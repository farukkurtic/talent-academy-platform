/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

import defaultPic from "../assets/defaults/defaultPic.svg";

import { Heart, MessageSquare, X, MoreVertical, Trash } from "lucide-react";

import kodiranje from "../assets/badges/kodiranje.svg";
import pisanje from "../assets/badges/kreativnoPisanje.svg";
import graficki from "../assets/badges/grafickiDizajn.svg";
import novinarstvo from "../assets/badges/novinarstvo.svg";
import muzika from "../assets/badges/muzickaProdukcija.svg";

const API_URL = import.meta.env.VITE_API_URL;

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
  const replyTextareaRef = useRef(null);
  const commentValue = watch("comment", "");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  const [replyLikedUsers, setReplyLikedUsers] = useState([]);
  const [isReplyLikesModalOpen, setIsReplyLikesModalOpen] = useState(false);
  const [currentReplyId, setCurrentReplyId] = useState(null);
  const [commentLikedUsers, setCommentLikedUsers] = useState([]);
  const [isCommentLikesModalOpen, setIsCommentLikesModalOpen] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    setIsLiked(likes.includes(currentUserId));
    setLikeCount(likes.length);
  }, [likes, currentUserId]);

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const openLikesModal = async () => {
    setIsLikesModalOpen(true);
    await fetchLikedUsers();
  };

  const closeLikesModal = () => {
    setIsLikesModalOpen(false);
  };

  const openCommentLikesModal = async (commentId) => {
    setCurrentCommentId(commentId);
    setIsCommentLikesModalOpen(true);
    await fetchCommentLikedUsers(commentId);
  };

  const closeCommentLikesModal = () => {
    setIsCommentLikesModalOpen(false);
    setCurrentCommentId(null);
  };

  const fetchCommentLikedUsers = async (commentId) => {
    try {
      const comment = comments.find((c) => c._id === commentId);

      if (comment) {
        const users = await Promise.all(
          comment.likes.map(async (userId) => {
            const response = await axios.get(
              `${API_URL}/api/user/id/${userId}`
            );
            return response.data.user;
          })
        );
        setCommentLikedUsers(users);
      }
    } catch (err) {
      console.error("Error fetching comment liked users:", err);
    }
  };

  const openReplyLikesModal = async (replyId) => {
    setCurrentReplyId(replyId);
    setIsReplyLikesModalOpen(true);
    await fetchReplyLikedUsers(replyId);
  };

  const closeReplyLikesModal = () => {
    setIsReplyLikesModalOpen(false);
    setCurrentReplyId(null);
  };

  const fetchReplyLikedUsers = async (replyId) => {
    try {
      let reply = null;
      for (const comment of comments) {
        const foundReply = comment.replies.find((r) => r._id === replyId);
        if (foundReply) {
          reply = foundReply;
          break;
        }
      }

      if (reply) {
        const users = await Promise.all(
          reply.likes.map(async (userId) => {
            const response = await axios.get(
              `${API_URL}/api/user/id/${userId}`
            );
            return response.data.user;
          })
        );
        setReplyLikedUsers(users);
      }
    } catch (err) {
      console.error("Error fetching reply liked users:", err);
    }
  };

  const fetchLikedUsers = async () => {
    try {
      const users = await Promise.all(
        likes.map(async (userId) => {
          const response = await axios.get(`${API_URL}/api/user/id/${userId}`);
          return response.data.user;
        })
      );
      setLikedUsers(users);
    } catch (err) {
      console.error("Error fetching liked users:", err);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await axios.post(
          `${API_URL}/api/posts/${postId}/unlike`,
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
          `${API_URL}/api/posts/${postId}/like`,
          { userId: currentUserId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const response = await axios.get(
          `${API_URL}/api/user/id/${currentUserId}`
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
        `${API_URL}/api/posts/${postId}/comments`
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
        `${API_URL}/api/posts/${postId}/comment`,
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

      const userResponse = await axios.get(
        `${API_URL}/api/user/id/${currentUserId}`
      );
      const userDetails = userResponse.data.user;

      const newComment = {
        ...response.data,
        userId: userDetails,
      };

      setComments([...comments, newComment]);

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

  const handleLikeComment = async (commentId) => {
    try {
      await axios.post(
        `${API_URL}/api/posts/comments/${commentId}/like`,
        { userId: currentUserId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchComments();
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleAddReply = async (commentId, replyText) => {
    if (replyText.trim() === "") return;
    try {
      await axios.post(
        `${API_URL}/api/posts/${commentId}/replies`,
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
      fetchComments();
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  const handleReplyInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const getMediaDisplayClass = () => {
    const totalMedia = (picture?.length || 0) + (gif?.length || 0);
    if (totalMedia === 0) return "";
    if (totalMedia === 1) return "w-full";
    if (totalMedia === 2) return "grid grid-cols-2 gap-2";
    return "grid grid-cols-2 gap-2";
  };

  const allMedia = [
    ...(picture?.map((img) => `${API_URL}/api/posts/image/${img}`) || []),
    ...(gif || []),
  ];

  return (
    <div className="text-white w-sm lg:w-md border rounded-3xl p-5 mb-10 relative">
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
        {badge && (
          <img
            crossOrigin="anonymous"
            src={badge}
            alt="Badge"
            className="w-6 h-6"
          />
        )}
      </div>
      <div className="w-full mb-3">
        <p className="text-sm tracking-wider break-words">{content}</p>
      </div>
      <div className={`mt-3 ${getMediaDisplayClass()}`}>
        {picture?.map((img, index) => (
          <div key={`img-${index}`} className="relative">
            <img
              crossOrigin="anonymous"
              src={`${API_URL}/api/posts/image/${img}`}
              className={`${
                picture.length + (gif?.length || 0) === 1
                  ? "w-full"
                  : "w-full h-40"
              } object-cover rounded-lg`}
              alt={`Post image ${index}`}
              onClick={() => openModal(`${API_URL}/api/posts/image/${img}`)}
              style={{ cursor: "pointer" }}
            />
          </div>
        ))}

        {gif?.map((gifUrl, index) => (
          <div key={`gif-${index}`} className="relative">
            <img
              crossOrigin="anonymous"
              src={gifUrl}
              className={`${
                gif.length + (picture?.length || 0) === 1
                  ? "w-full"
                  : "w-full h-40"
              } object-cover rounded-lg`}
              alt={`Post GIF ${index}`}
              onClick={() => openModal(gifUrl)}
              style={{ cursor: "pointer" }}
            />
          </div>
        ))}
      </div>
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
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
        ariaHideApp={false}
      >
        <div className="relative max-w-4xl w-full">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-800 text-white"
          >
            <X size={24} />
          </button>
          {selectedImage && (
            <img
              crossOrigin="anonymous"
              src={selectedImage}
              alt="Expanded media"
              className="max-w-full max-h-[90vh] mx-auto rounded-lg"
            />
          )}
        </div>
      </Modal>
      <Modal
        isOpen={isReplyLikesModalOpen}
        onRequestClose={closeReplyLikesModal}
        className="fixed inset-0 flex items-center justify-center bg-transparent"
        ariaHideApp={false}
      >
        <div className="bg-white p-4 rounded-lg relative w-96 max-h-[80vh] overflow-y-auto">
          <button
            onClick={closeReplyLikesModal}
            className="absolute top-5 right-5 p-1 rounded-full bg-gray-200 transition-colors"
          >
            X
          </button>
          <h2 className="text-xl font-bold mb-4">Liked by</h2>
          <div className="space-y-3">
            {replyLikedUsers.map((user) => (
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
                        ? `${API_URL}/api/posts/image/${user?.image}`
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
      <Modal
        isOpen={isCommentLikesModalOpen}
        onRequestClose={closeCommentLikesModal}
        className="fixed inset-0 flex items-center justify-center bg-transparent"
        ariaHideApp={false}
      >
        <div className="bg-white p-4 rounded-lg relative w-96 max-h-[80vh] overflow-y-auto">
          <button
            onClick={closeCommentLikesModal}
            className="absolute top-5 right-5 p-1 rounded-full bg-gray-200 transition-colors"
          >
            X
          </button>
          <h2 className="text-xl font-bold mb-4">Liked by</h2>
          <div className="space-y-3">
            {commentLikedUsers.map((user) => (
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
                        ? `${API_URL}/api/posts/image/${user?.image}`
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
      <div className="w-3/5 flex items-center justify-between m-auto mt-5">
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
                        ? `${API_URL}/api/posts/image/${user?.image}`
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
          className="w-full p-2 bg-gray-800 text-white rounded-lg resize-none border border-gray-600 focus:outline-none tracking-wider"
          style={{ height: "auto", overflowY: "hidden" }}
          rows={1}
          onInput={handleInput}
          value={commentValue}
          onChange={(e) => setValue("comment", e.target.value)}
        />
        <button
          type="submit"
          className={`bg-primary mt-2 px-4 py-2 rounded-lg text-white w-full hover:bg-opacity-80 tracking-wider ${
            !commentValue.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!commentValue.trim()}
        >
          Objavi
        </button>
      </form>
      <div className={seeComments ? "visible" : "hidden"}>
        {comments.map((cmt) => (
          <div
            key={cmt._id}
            className="bg-gray-800 p-4 rounded-lg mt-2 text-sm"
          >
            <a
              href={
                cmt.userId._id === currentUserId
                  ? "/moj-profil"
                  : `/profil/${cmt.userId._id}`
              }
            >
              <div className="flex items-center justify-start mb-3">
                <img
                  crossOrigin="anonymous"
                  src={
                    cmt?.userId.image
                      ? `${API_URL}/api/posts/image/${cmt?.userId.image}`
                      : defaultPic
                  }
                  className="w-10 h-10 rounded-full mr-3"
                  alt="Profile"
                />
                <p className="tracking-wider font-bold mr-3">
                  {cmt.userId.firstName} {cmt.userId.lastName}
                </p>
                <span>
                  {(() => {
                    switch (cmt.userId.major) {
                      case "Muzička produkcija":
                        return <img src={muzika} className="w-4" />;
                      case "Odgovorno kodiranje":
                        return <img src={kodiranje} className="w-4" />;
                      case "Novinarstvo":
                        return <img src={novinarstvo} className="w-4" />;
                      case "Kreativno pisanje":
                        return <img src={pisanje} className="w-4" />;
                      case "Grafički dizajn":
                        return <img src={graficki} className="w-4" />;
                    }
                  })()}
                </span>
              </div>
            </a>
            <p className="break-words mb-3">{cmt.text}</p>
            <div className="flex items-center gap-3">
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
              <button
                onClick={() => openCommentLikesModal(cmt._id)}
                className="hover:text-primary cursor-pointer"
              >
                {cmt.likes.length}
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setReplyingTo(cmt._id);
                    toggleReplies(cmt._id);
                  }}
                >
                  <MessageSquare
                    size={20}
                    strokeWidth={1}
                    className="hover:text-primary cursor-pointer mr-2"
                  />
                </button>
                {cmt.replies.length > 0 && (
                  <span className="text-sm">{cmt.replies.length}</span>
                )}
              </div>
            </div>
            {showReplies[cmt._id] && (
              <>
                {cmt.replies.map((reply) => (
                  <div key={reply._id} className="ml-4 mt-5">
                    <a
                      href={
                        cmt.userId._id === currentUserId
                          ? "/moj-profil"
                          : `/profil/${cmt.userId._id}`
                      }
                    >
                      <div className="flex items-center justify-start mb-2">
                        <img
                          crossOrigin="anonymous"
                          src={
                            reply?.userId.image
                              ? `${API_URL}/api/posts/image/${reply?.userId.image}`
                              : defaultPic
                          }
                          className="w-8 h-8 rounded-full mr-2"
                          alt="Profile"
                        />
                        <p className="tracking-wider font-bold mr-3">
                          {reply.userId.firstName} {reply.userId.lastName}
                        </p>
                        <span>
                          {(() => {
                            switch (cmt.userId.major) {
                              case "Muzička produkcija":
                                return <img src={muzika} className="w-4" />;
                              case "Odgovorno kodiranje":
                                return <img src={kodiranje} className="w-4" />;
                              case "Novinarstvo":
                                return (
                                  <img src={novinarstvo} className="w-4" />
                                );
                              case "Kreativno pisanje":
                                return <img src={pisanje} className="w-4" />;
                              case "Grafički dizajn":
                                return <img src={graficki} className="w-4" />;
                            }
                          })()}
                        </span>
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
                      <button
                        onClick={() => openReplyLikesModal(reply._id)}
                        className="hover:text-primary cursor-pointer"
                      >
                        {reply.likes.length}
                      </button>
                    </div>
                  </div>
                ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddReply(cmt._id, replyText);
                    setReplyText("");
                    if (replyTextareaRef.current) {
                      replyTextareaRef.current.style.height = "40px";
                    }
                  }}
                  className="mt-5 lg:flex lg:items-center lg:justify-center gap-2"
                >
                  <textarea
                    name="reply"
                    placeholder="Napiši odgovor..."
                    className="w-full p-2 bg-gray-700 text-white rounded-lg resize-none border border-gray-600 focus:outline-none overflow-hidden"
                    rows={1}
                    ref={replyTextareaRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onInput={handleReplyInput}
                    style={{ minHeight: "40px", height: "40px" }}
                  />
                  <button
                    type="submit"
                    className={`bg-primary p-2 rounded-lg text-white hover:bg-opacity-80 cursor-pointer w-full lg:w-auto mt-2 lg:mt-0 ${
                      !replyText.trim() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!replyText.trim()}
                  >
                    Odgovori
                  </button>
                </form>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
