import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Image, SearchIcon, ImagePlay, X } from "lucide-react";
import Modal from "react-modal";
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";

const gf = new GiphyFetch("czM41rghaxLbQ1BT2TP9HOHpk8AfzxfW"); // Replace with your actual API key

const CreatePost = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedGif, setSelectedGif] = useState(null);
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const textareaRef = useRef(null);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [selectedImage, selectedGif, searchQuery]); // This triggers the effect when any of these change

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

  const onSubmit = (data) => {
    console.log({
      text: data.text,
      image: selectedImage,
      gif: selectedGif,
    });

    // Reset the form values and state
    reset(); // Reset form values
    setSelectedImage(null); // Clear selected image
    setSelectedGif(null); // Clear selected GIF

    // Refresh the page
    window.location.reload();
  };

  return (
    <div className="p-4 border rounded-3xl shadow-md w-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          {...register("text")} // Register with react-hook-form
          ref={textareaRef}
          placeholder="O čemu razmišljate?"
          className="w-full p-2 resize-none overflow-hidden focus:outline-none focus:ring-0 focus:border-transparent"
          onChange={(e) => setValue("text", e.target.value)} // Update form state manually
        />

        <div
          className={`mt-2 flex gap-3 ${
            selectedImage && selectedGif ? "flex-row" : "flex-col"
          }`}
        >
          {/* Selected Image */}
          {selectedImage && (
            <div className={`${selectedGif ? "w-1/2" : "w-full"} relative`}>
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Selected GIF */}
          {selectedGif && (
            <div className={`${selectedImage ? "w-1/2" : "w-full"} relative`}>
              <img
                src={selectedGif}
                alt="Selected GIF"
                className="w-full rounded-lg"
              />
              <button
                onClick={() => setSelectedGif(null)}
                className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* File Upload for Images & GIF Selection */}
        <div className="flex items-center gap-3 mt-3">
          {/* Image Upload */}
          <label className="cursor-pointer">
            <Image size={24} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith("image/")) {
                  setSelectedImage(URL.createObjectURL(file)); // Update selected image
                } else {
                  alert("Please select a valid image file.");
                  e.target.value = "";
                }
              }}
            />
          </label>

          {/* GIF Selection Button */}
          <button type="button" onClick={openGifModal}>
            <ImagePlay size={24} />
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-primary text-black p-2 rounded-full ml-auto w-20 cursor-pointer"
          >
            Objavi
          </button>
        </div>
      </form>

      {/* Giphy Modal */}
      <Modal
        isOpen={isGifModalOpen}
        onRequestClose={closeGifModal}
        contentLabel="Select a GIF"
        ariaHideApp={false}
        className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-lg mx-auto max-h-[80vh] overflow-hidden"
      >
        <h2 className="text-lg font-bold mb-2">Select a GIF</h2>

        {/* Search Input for GIFs */}
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

        {/* Scrollable Container for GIFs */}
        <div className="overflow-y-auto max-h-[60vh] flex justify-center">
          <Grid
            key={searchQuery}
            width={450} // Adjust width to better fit three columns
            columns={3} // Use three columns for better spacing
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
