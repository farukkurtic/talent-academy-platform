/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { Heart, MessageSquare } from "lucide-react";
import { useState, useRef } from "react";

export default function Post({
  profilePic,
  username,
  badge,
  content,
  picture,
  gif,
  likes,
  comments,
}) {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const textareaRef = useRef(null);
  const commentValue = watch("comment", "");

  const onSubmit = (data) => {
    if (data.comment.trim() === "") return;
    console.log(data.comment);
    textareaRef.current.style.height = "auto"; // Reset height
  };

  // Auto-expand textarea height
  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset height to recalculate
    textarea.style.height = `${textarea.scrollHeight}px`; // Set to new height
  };

  return (
    <div className="text-white w-md border rounded-3xl p-5 mb-10">
      {/* User Info */}
      <div className="w-full flex items-center mb-3">
        <img
          src={profilePic}
          className="mr-5 w-12 h-12 rounded-full"
          alt="Profile"
        />
        <h1 className="mr-5 text-lg tracking-wide">{username}</h1>
        <img src={badge} alt="Badge" className="w-6 h-6" />
      </div>

      {/* Post Content */}
      <div className="w-full mb-3">
        <p className="text-sm tracking-wider">{content}</p>
      </div>

      {/* Image/GIF Section */}
      <div className="w-full flex gap-2">
        {picture && gif ? (
          <>
            <img
              src={picture}
              className="w-1/2 rounded-lg"
              alt="Uploaded Image"
            />
            <img src={gif} className="w-1/2 rounded-lg" alt="Uploaded GIF" />
          </>
        ) : picture ? (
          <img
            src={picture}
            className="w-full rounded-lg"
            alt="Uploaded Image"
          />
        ) : gif ? (
          <img src={gif} className="w-full rounded-lg" alt="Uploaded GIF" />
        ) : null}
      </div>

      {/* Like and Comment Buttons */}
      <div className="w-3/5 flex items-center justify-between m-auto mt-3">
        <div className="flex items-center">
          <Heart
            size={32}
            strokeWidth={1}
            className="mr-2 hover:text-primary cursor-pointer"
          />
          <p>{likes || 0}</p>
        </div>
        <div className="flex items-center">
          <MessageSquare
            size={32}
            strokeWidth={1}
            className="mr-2 hover:text-primary cursor-pointer"
          />
          <p>{comments?.length || 0}</p>
        </div>
      </div>

      {/* Comment Input Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 border-t border-gray-700 pt-3"
      >
        <textarea
          {...register("comment")}
          ref={textareaRef}
          placeholder="Napiši komentar..."
          className="w-full p-2 bg-gray-800 text-white rounded-lg resize-none border border-gray-600 focus:outline-none focus:border-primary overflow-hidden"
          rows="1"
          onInput={handleInput}
          value={commentValue}
          onChange={(e) => setValue("comment", e.target.value)}
        />
        <button
          type="submit"
          className="bg-primary mt-2 px-4 py-2 rounded-lg text-white w-full hover:bg-opacity-80 transition cursor-pointer"
        >
          Objavi
        </button>
      </form>

      {/* Display Comments */}
      <div className="mt-3">
        {comments?.map((cmt, index) => (
          <div key={index} className="bg-gray-800 p-2 rounded-lg mt-2 text-sm">
            {cmt}
          </div>
        ))}
      </div>
    </div>
  );
}
