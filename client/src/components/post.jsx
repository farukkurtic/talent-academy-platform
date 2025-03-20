/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

import defaultPic from "../assets/defaults/defaultPic.svg";

import { Heart, MessageSquare, X, MoreVertical, Trash } from "lucide-react";

export default function Post({
  profilePic,
  firstName,
  lastName,
  badge,
  content,
  picture,
  gif,
  likes: initialLikes,
  comments: initialComments,
  deletePost,
  postId,
  postUserId,
  currentUserId,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [likes, setLikes] = useState(initialLikes || []);
  const [isLiked, setIsLiked] = useState(likes.includes(currentUserId));
  const [likeCount, setLikeCount] = useState(likes.length);
  const [likedUsers, setLikedUsers] = useState([]);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [comments, setComments] = useState(initialComments || []);
  const [seeComments, setSeeComments] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const textareaRef = useRef(null);
  const commentValue = watch("comment", "");
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    setIsLiked(likes.includes(currentUserId));
    setLikeCount(likes.length);
  }, [likes, currentUserId]);

  const fetchLikedUsers = async () => {
    try {
      const users = await Promise.all(
        likes.map(async (userId) => {
          const response = await axios.get(
            `http://localhost:5000/api/user/id/${userId}`
          );
          return response.data.user;
        })
      );
      setLikedUsers(users);
    } catch (err) {
      console.error("Error fetching liked users:", err);
    }
  };

  const openLikesModal = async () => {
    setIsLikesModalOpen(true);
    await fetchLikedUsers();
  };

  const closeLikesModal = () => {
    setIsLikesModalOpen(false);
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await axios.post(
          `http://localhost:5000/api/posts/${postId}/unlike`,
          { userId: currentUserId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLikes((prev) => prev.filter((id) => id !== currentUserId));
      } else {
        await axios.post(
          `http://localhost:5000/api/posts/${postId}/like`,
          { userId: currentUserId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const response = await axios.get(
          `http://localhost:5000/api/user/id/${currentUserId}`
        );
        setLikes((prev) => [...prev, currentUserId]);
        setLikedUsers((prev) => [...prev, response.data.user]);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/posts/${postId}/comments`
      );
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async (commentText) => {
    if (commentText.trim() === "") return;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        {
          userId: currentUserId,
          text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComments([...comments, response.data]);
      reset();
      setValue("comment", "");
      textareaRef.current.style.height = "auto";
      setSeeComments(true);
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const onSubmit = (data) => {
    handleAddComment(data.comment);
  };

  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleDelete = async () => {
    try {
      await deletePost(postId);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const openModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // --------------------------------------------------------------
  const handleLikeComment = async (commentId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/posts/comments/${commentId}/like`,
        { userId: currentUserId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchComments(); // Refresh comments after liking
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleAddReply = async (commentId, replyText) => {
    if (replyText.trim() === "") return;
    try {
      await axios.post(
        `http://localhost:5000/api/posts/comments/${commentId}/replies`,
        {
          userId: currentUserId,
          text: replyText,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchComments(); // Refresh comments after adding reply
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  return (
    <div className="text-white w-xs lg:w-md border rounded-3xl p-5 mb-10 relative">
      <div className="w-full flex items-center mb-3">
        {profilePic && (
          <a
            href={
              currentUserId !== postUserId
                ? `/profil/${postUserId}`
                : "/moj-profil"
            }
          >
            <img
              crossOrigin="anonymous"
              src={profilePic ? profilePic : defaultPic}
              className="mr-5 w-12 h-12 rounded-full cursor-pointer"
              alt="Profile"
            />
          </a>
        )}
        <h1 className="mr-5 text-lg tracking-wide cursor-pointer">
          <a
            href={
              currentUserId !== postUserId
                ? `/profil/${postUserId}`
                : "/moj-profil"
            }
          >
            {firstName} {lastName}
          </a>
        </h1>
        {badge && <img src={badge} alt="Badge" className="w-6 h-6" />}
      </div>
      <div className="w-full mb-3">
        <p className="text-sm tracking-wider break-words">{content}</p>
      </div>
      {(picture || gif) && (
        <div
          className={`w-full flex gap-2 ${
            picture && gif ? "flex-row" : "flex-col"
          }`}
        >
          {picture && (
            <img
              crossOrigin="anonymous"
              src={picture}
              className={gif ? "w-1/2 rounded-lg" : "w-full rounded-lg"}
              alt="Uploaded Image"
              onClick={() => openModal(picture)}
              style={{ cursor: "pointer" }}
            />
          )}
          {gif && (
            <img
              src={gif}
              className={picture ? "w-1/2 rounded-lg" : "w-full rounded-lg"}
              alt="Uploaded GIF"
              onClick={() => openModal(gif)}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>
      )}
      {postUserId === currentUserId && (
        <div className="absolute top-8 right-10">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <MoreVertical size={24} className="text-white cursor-pointer" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-24 bg-black border border-gray-700 rounded-lg shadow-lg">
              <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 px-4 py-2 cursor-pointer w-full text-primary"
              >
                <Trash />
                Obriši
              </button>
            </div>
          )}
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center bg-transparent"
        ariaHideApp={false}
      >
        <div className="bg-black p-4 rounded-lg relative">
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 p-1 rounded-full bg-gray-200 transition-colors"
          >
            <X size={24} className="text-gray-700" />
          </button>
          {selectedImage && (
            <img
              crossOrigin="anonymous"
              src={selectedImage}
              alt="Expanded"
              className="max-w-full max-h-[90vh] rounded-lg"
            />
          )}
        </div>
      </Modal>
      <div className="w-3/5 flex items-center justify-between m-auto mt-3">
        <div className="flex items-center">
          <button onClick={handleLike}>
            <Heart
              size={32}
              strokeWidth={1}
              className={`mr-2 hover:text-primary cursor-pointer ${
                isLiked ? "fill-primary text-primary" : ""
              }`}
            />
          </button>
          <button onClick={openLikesModal}>
            <p className="hover:text-primary cursor-pointer">{likeCount}</p>
          </button>
        </div>
        <div className="flex items-center">
          <MessageSquare
            size={32}
            strokeWidth={1}
            className="mr-2 hover:text-primary cursor-pointer"
            onClick={() => {
              textareaRef.current.focus();
              setSeeComments(!seeComments);
            }}
          />
          <p>{comments?.length || 0}</p>
        </div>
      </div>
      <Modal
        isOpen={isLikesModalOpen}
        onRequestClose={closeLikesModal}
        className="fixed inset-0 flex items-center justify-center bg-transparent"
        ariaHideApp={false}
      >
        <div className="bg-white p-4 rounded-lg relative w-96 max-h-[80vh] overflow-y-auto">
          <button
            onClick={closeLikesModal}
            className="absolute top-5 right-5 p-1 rounded-full bg-gray-200 transition-colors"
          >
            X
          </button>
          <h2 className="text-xl font-bold mb-4">Liked by</h2>
          <div className="space-y-3">
            {likedUsers.map((user) => (
              <a
                href={
                  currentUserId == user._id
                    ? "/moj-profil"
                    : `/profil/${user._id}`
                }
                key={user._id}
              >
                <div className="flex items-center mb-3">
                  <img
                    crossOrigin="anonymous"
                    src={
                      user.image
                        ? `http://localhost:5000/api/posts/image/${user?.image}`
                        : defaultPic
                    }
                    className="w-10 h-10 mr-3 rounded-full"
                  />
                  <p className="text-gray-800">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Modal>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 border-t border-gray-700 pt-3"
      >
        <textarea
          {...register("comment")}
          ref={textareaRef}
          placeholder="Napiši komentar..."
          className="w-full p-2 bg-gray-800 text-white rounded-lg resize-none border border-gray-600 focus:outline-none"
          style={{ height: "auto", overflowY: "hidden" }}
          rows={1}
          onInput={handleInput}
          value={commentValue}
          onChange={(e) => setValue("comment", e.target.value)}
        />
        <button
          type="submit"
          className="bg-primary mt-2 px-4 py-2 rounded-lg text-white w-full hover:bg-opacity-80"
        >
          Objavi
        </button>
      </form>
      <div className={seeComments ? "visible" : "hidden"}>
        {comments.map((cmt) => (
          <div
            key={cmt._id}
            className="bg-gray-800 p-2 rounded-lg mt-2 text-sm"
          >
            <a href={`/profil/${cmt.userId}`}>
              <div className="flex items-center justify-start mb-3">
                <img
                  src={cmt.user?.image || defaultPic}
                  className="w-10 h-10 rounded-full mr-3"
                  alt="Profile"
                />
                <p className="tracking-wider font-bold">
                  {cmt.user?.firstName} {cmt.user?.lastName}
                </p>
              </div>
            </a>
            <p className="break-words mb-3">{cmt.text}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => handleLikeComment(cmt._id)}>
                <Heart
                  size={20}
                  strokeWidth={1}
                  className={`hover:text-primary cursor-pointer ${
                    cmt.likes.includes(currentUserId)
                      ? "fill-primary text-primary"
                      : ""
                  }`}
                />
              </button>
              <span>{cmt.likes.length}</span>
              <button onClick={() => setReplyingTo(cmt._id)}>
                <MessageSquare
                  size={20}
                  strokeWidth={1}
                  className="hover:text-primary cursor-pointer"
                />
              </button>
            </div>
            {replyingTo === cmt._id && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddReply(cmt._id, e.target.reply.value);
                  setReplyingTo(null);
                }}
                className="mt-2"
              >
                <textarea
                  name="reply"
                  placeholder="Napiši odgovor..."
                  className="w-full p-2 bg-gray-700 text-white rounded-lg resize-none border border-gray-600 focus:outline-none"
                  rows={1}
                />
                <button
                  type="submit"
                  className="bg-primary mt-2 px-4 py-1 rounded-lg text-white hover:bg-opacity-80"
                >
                  Pošalji
                </button>
              </form>
            )}
            {cmt.replies.map((reply) => (
              <div key={reply._id} className="ml-4 mt-2">
                <a href={`/profil/${reply.userId}`}>
                  <div className="flex items-center justify-start mb-2">
                    <img
                      src={reply.user?.image || defaultPic}
                      className="w-8 h-8 rounded-full mr-2"
                      alt="Profile"
                    />
                    <p className="tracking-wider font-bold">
                      {reply.user?.firstName} {reply.user?.lastName}
                    </p>
                  </div>
                </a>
                <p className="break-words mb-2">{reply.text}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleLikeComment(reply._id)}>
                    <Heart
                      size={16}
                      strokeWidth={1}
                      className={`hover:text-primary cursor-pointer ${
                        reply.likes.includes(currentUserId)
                          ? "fill-primary text-primary"
                          : ""
                      }`}
                    />
                  </button>
                  <span>{reply.likes.length}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
