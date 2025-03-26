/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Image, SearchIcon, ImagePlay, X } from "lucide-react";
import Modal from "react-modal";
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import axios from "axios";

const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_KEY);

const CreatePost = ({ userId, refreshFeed }) => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [postContent, setPostContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [selectedGifs, setSelectedGifs] = useState([]);
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [postContent, selectedImages, selectedGifs, searchQuery]);

  const getMediaGridClass = () => {
    const totalMedia = selectedImages.length + selectedGifs.length;
    if (totalMedia === 0) return "";
    if (totalMedia === 1) return "w-full";
    if (totalMedia === 2) return "grid grid-cols-2 gap-2";
    return "grid grid-cols-2 gap-2";
  };

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
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    if (validImages.length === 0) {
      alert("Molimo odaberite sliku.");
      e.target.value = "";
      return;
    }

    const newImageFiles = [...imageFiles, ...validImages];
    const newImagePreviews = [
      ...selectedImages,
      ...validImages.map((file) => URL.createObjectURL(file)),
    ];

    setImageFiles(newImageFiles);
    setSelectedImages(newImagePreviews);
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    const newImages = [...selectedImages];
    const newFiles = [...imageFiles];

    newImages.splice(index, 1);
    newFiles.splice(index, 1);

    setSelectedImages(newImages);
    setImageFiles(newFiles);
  };

  const handleRemoveGif = (index) => {
    const newGifs = [...selectedGifs];
    newGifs.splice(index, 1);
    setSelectedGifs(newGifs);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("text", data.text);

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    formData.append("gifs", JSON.stringify(selectedGifs));
    formData.append("userId", userId);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/posts",
        formData
      );

      setSelectedImages([]);
      setImageFiles([]);
      setSelectedGifs([]);
      setPostContent("");
      reset({ text: "" });

      if (textareaRef.current) {
        textareaRef.current.value = "";
        textareaRef.current.style.height = "auto";
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      refreshFeed();
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-4 border rounded-3xl shadow-md w-xs lg:w-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          {...register("text")}
          ref={textareaRef}
          placeholder="O čemu razmišljate?"
          className="w-full p-2 resize-none overflow-hidden focus:outline-none focus:ring-0 focus:border-transparent"
          onChange={(e) => {
            setValue("text", e.target.value);
            setPostContent(e.target.value.trim());
          }}
        />
        <div className={`mt-2 ${getMediaGridClass()}`}>
          {selectedImages.map((image, index) => (
            <div key={`image-${index}`} className="relative">
              <img
                src={image}
                alt={`Selected ${index}`}
                className={`${
                  selectedImages.length + selectedGifs.length === 1
                    ? "w-full"
                    : "w-full h-40"
                } object-cover rounded-lg`}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>
          ))}
          {selectedGifs.map((gif, index) => (
            <div key={`gif-${index}`} className="relative">
              <img
                src={gif}
                alt={`Selected GIF ${index}`}
                className={`${
                  selectedImages.length + selectedGifs.length === 1
                    ? "w-full"
                    : "w-full h-40"
                } object-cover rounded-lg`}
              />
              <button
                type="button"
                onClick={() => handleRemoveGif(index)}
                className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>
          ))}
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
              multiple
            />
          </label>
          <button type="button" onClick={openGifModal}>
            <ImagePlay size={24} />
          </button>
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded-full ml-auto w-20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              !postContent &&
              selectedImages.length === 0 &&
              selectedGifs.length === 0
            }
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
        className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-lg mx-auto max-h-[80vh] overflow-hidden mt-20 lg:mt-10"
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
              setSelectedGifs([...selectedGifs, gif.images.fixed_width.url]);
              closeGifModal();
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default CreatePost;
