/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import line1 from "../assets/lines/s1.svg";
import line5 from "../assets/lines/s5.svg";

import defaultPic from "../assets/defaults/defaultPic.svg";

import kodiranje from "../assets/badges/kodiranje.svg";
import pisanje from "../assets/badges/kreativnoPisanje.svg";
import graficki from "../assets/badges/grafickiDizajn.svg";
import novinarstvo from "../assets/badges/novinarstvo.svg";
import muzika from "../assets/badges/muzickaProdukcija.svg";

import Sidebar from "../components/sidebar";
import CreatePost from "../components/createPost";
import Post from "../components/post";

export default function Feed() {
  const [allPosts, setAllPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const majorBadges = {
    "Odgovorno kodiranje": kodiranje,
    "Kreativno pisanje": pisanje,
    "Grafički dizajn": graficki,
    Novinarstvo: novinarstvo,
    "Muzička produkcija": muzika,
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/prijava");
    } else {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/posts");
      const posts = response.data.posts;

      const postsWithUsers = await Promise.all(
        posts.map(async (post) => {
          try {
            if (!post.userId || typeof post.userId !== "string") {
              console.warn("Invalid userId for post:", post._id);
              return { ...post, user: null, badge: null };
            }

            const userResponse = await axios.get(
              `http://localhost:5000/api/user/id/${post.userId}`
            );

            if (userResponse.data.user?.major in majorBadges) {
              return {
                ...post,
                user: userResponse.data.user,
                badge: majorBadges[userResponse.data.user.major],
              };
            } else {
              return { ...post, user: userResponse.data.user, badge: null };
            }
          } catch (userError) {
            console.error("Error fetching user:", userError);
            return { ...post, user: null, badge: null };
          }
        })
      );

      setAllPosts(postsWithUsers);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err.response?.data || err.message);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/search?name=${query}`
        );
        setSearchResults(response.data.users);
      } catch (err) {
        console.error("Error searching users:", err);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="text-white h-screen relative flex items-center justify-center">
      <img
        src={line1}
        className="fixed -top-40 right-0 rotate-180 hidden lg:block"
      />
      <img src={line5} className="fixed -bottom-30 -right-63 hidden lg:block" />
      <Sidebar
        userId={userId}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        searchResults={searchResults}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <div className="flex flex-col items-center gap-4 absolute top-10">
        <div className="mt-25 lg:mt-0">
          <CreatePost userId={userId} refreshFeed={fetchPosts} />
        </div>
        <div>
          {allPosts.map((post) => (
            <Post
              key={post._id}
              profilePic={
                post.user?.image
                  ? `http://localhost:5000/api/posts/image/${post.user.image}`
                  : defaultPic
              }
              firstName={post.user?.firstName || "Unknown"}
              lastName={post.user?.lastName || "User"}
              content={post.content}
              picture={
                post?.image
                  ? `http://localhost:5000/api/posts/image/${post?.image}`
                  : null
              }
              gif={post.gif}
              badge={post.badge}
              likes={post.likes}
              postId={post._id}
              postUserId={post.userId}
              currentUserId={userId}
              deletePost={deletePost}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
