import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Image, SearchIcon, ImagePlay, X } from "lucide-react";
import Modal from "react-modal";
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import axios from "axios";

const gf = new GiphyFetch("czM41rghaxLbQ1BT2TP9HOHpk8AfzxfW");

// eslint-disable-next-line react/prop-types
const CreatePost = ({ userId, refreshFeed }) => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedGif, setSelectedGif] = useState(null);
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [postContent, selectedImage, selectedGif, searchQuery]);

  const openGifModal = () => setIsGifModalOpen(true);
  const closeGifModal = () => {
    setSearchQuery("");
    setIsGifModalOpen(false);
  };

  const fetchGifs = (offset) => {
    return searchQuery
      ? gf.search(searchQuery, { offset, limit: 10 })
      : gf.trending({ offset, limit: 10 });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file.");
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    fileInputRef.current.value = "";
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("text", data.text);
    if (imageFile) formData.append("image", imageFile);
    if (selectedGif) formData.append("gif", selectedGif);
    formData.append("userId", userId);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Post created:", response.data);

      // Reset form states
      setSelectedImage(null);
      setImageFile(null);
      setSelectedGif(null);
      reset({ text: "" }); // Explicitly reset the text field
      if (textareaRef.current) {
        textareaRef.current.value = ""; // Manually clear the textarea
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input
      }

      // Refresh the feed after creating a new post
      refreshFeed();
    } catch (err) {
      console.log("Error creating post:", err);
    }
  };

  return (
    <div className="p-4 border rounded-3xl shadow-md w-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          {...register("text")}
          ref={textareaRef}
          placeholder="O čemu razmišljate?"
          className="w-full p-2 resize-none overflow-hidden focus:outline-none focus:ring-0 focus:border-transparent"
          onChange={(e) => {
            setValue("text", e.target.value);
            setPostContent(e.target.value.trim()); // Trim to remove extra spaces
          }}
        />

        <div
          className={`mt-2 flex gap-3 ${
            selectedImage && selectedGif ? "flex-row" : "flex-col"
          }`}
        >
          {selectedImage && (
            <div className={`${selectedGif ? "w-1/2" : "w-full"} relative`}>
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {selectedGif && (
            <div className={`${selectedImage ? "w-1/2" : "w-full"} relative`}>
              <img
                src={selectedGif}
                alt="Selected GIF"
                className="w-full rounded-lg"
              />
              <button
                type="button"
                onClick={() => setSelectedGif(null)}
                className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-3">
          <label className="cursor-pointer">
            <Image size={24} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          <button type="button" onClick={openGifModal}>
            <ImagePlay size={24} />
          </button>

          <button
            type="submit"
            className="bg-primary text-black p-2 rounded-full ml-auto w-20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!postContent}
          >
            Objavi
          </button>
        </div>
      </form>

      <Modal
        isOpen={isGifModalOpen}
        onRequestClose={closeGifModal}
        contentLabel="Select a GIF"
        ariaHideApp={false}
        className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-lg mx-auto max-h-[80vh] overflow-hidden"
      >
        <h2 className="text-lg font-bold mb-2">Select a GIF</h2>

        <div className="flex items-center gap-2 mb-3 border p-2 rounded">
          <SearchIcon size={20} />
          <input
            type="text"
            placeholder="Search GIFs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 focus:outline-none"
          />
        </div>

        <div className="overflow-y-auto max-h-[60vh] flex justify-center">
          <Grid
            key={searchQuery}
            width={450}
            columns={3}
            fetchGifs={fetchGifs}
            onGifClick={(gif, e) => {
              e.preventDefault();
              setSelectedGif(gif.images.fixed_width.url);
              closeGifModal();
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default CreatePost;
