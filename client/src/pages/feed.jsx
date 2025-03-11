import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import { useUnreadMessages } from "../../contexts/UnreadMessagesContext";

import hntaLogo from "../assets/hnta-logo.png";
import textLogo from "../assets/textLogo.svg";
import defaultPic from "../assets/default-image.png";

import line1 from "../assets/lines/s1.svg";
import line5 from "../assets/lines/s5.svg";

// badges
import kodiranje from "../assets/kodiranje.svg";
import pisanje from "../assets/kreativnoPisanje.svg";
import graficki from "../assets/grafickiDizajn.svg";
import novinarstvo from "../assets/novinarstvo.svg";
import muzika from "../assets/muzickaProdukcija.svg";

import { MessageSquare, GraduationCap, UserPen, Menu } from "lucide-react";

import CreatePost from "../components/createPost";
import Post from "../components/post";

export default function Feed() {
  const [allPosts, setAllPosts] = useState([]);
  const [userId, setUserId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/prijava");
    } else {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  // Function to fetch posts and update the state
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/posts");
      const posts = response.data.posts;

      // Fetch user data for each post
      const postsWithUsers = await Promise.all(
        posts.map(async (post) => {
          try {
            const userResponse = await axios.get(
              `http://localhost:5000/api/user/id/${post.userId}`
            );

            if (userResponse.data.user.major === "Odgovorno kodiranje") {
              return {
                ...post,
                user: userResponse.data.user,
                badge: kodiranje,
              };
            } else if (userResponse.data.user.major === "Kreativno pisanje") {
              return {
                ...post,
                user: userResponse.data.user,
                badge: pisanje,
              };
            } else if (userResponse.data.user.major === "Grafički dizajn") {
              return {
                ...post,
                user: userResponse.data.user,
                badge: graficki,
              };
            } else if (userResponse.data.user.major === "Novinarstvo") {
              return {
                ...post,
                user: userResponse.data.user,
                badge: novinarstvo,
              };
            } else if (userResponse.data.user.major === "Muzička produkcija") {
              return {
                ...post,
                user: userResponse.data.user,
                badge: muzika,
              };
            }
          } catch (userError) {
            console.error("Error fetching user:", userError);
            return { ...post, user: null }; // Handle missing user data gracefully
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
      console.log("Deleting post with ID:", postId); // Debugging
      const response = await axios.delete(
        `http://localhost:5000/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Delete response:", response.data); // Debugging
      fetchPosts(); // Refresh posts after deletion
    } catch (err) {
      console.error("Error deleting post:", err.response?.data || err.message); // Debugging
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

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu

  return (
    <div className="text-white h-screen relative flex items-center justify-center">
      <img
        src={line1}
        className="fixed -top-40 right-0 rotate-180 hidden lg:block"
      />
      <img src={line5} className="fixed -bottom-30 -right-63 hidden lg:block" />

      {/* Header (Mobile Only) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 p-4 flex justify-between items-center border-b border-gray-700 z-50 bg-black">
        {/* Logo Section */}
        <a href="/feed" className="cursor-pointer">
          <div className="flex items-center">
            <img src={hntaLogo} alt="hnta-logo" className="w-10" />
            <img
              src={textLogo}
              alt="hnta-text-logo"
              className="w-32 h-10 ml-2"
            />
          </div>
        </a>

        {/* Hamburger Menu */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu size={32} className="text-primary" />
        </button>
      </div>

      {/* Sidebar (Desktop Only) */}
      <div className="hidden lg:block fixed w-85 top-0 bottom-0 left-0 border-r border-gray-700 bg-black p-6">
        {/* Logo Section */}
        <a href="/feed" className="cursor-pointer">
          <div className="logo-container flex items-center justify-center">
            <img src={hntaLogo} alt="hnta-logo" className="w-20" />
            <img
              src={textLogo}
              alt="hnta-text-logo"
              className="w-40 h-40 ml-2"
            />
          </div>
        </a>

        {/* Search Bar */}
        <div className="text-center my-6">
          <input
            type="text"
            placeholder="Pretraži korisnike..."
            className="border p-3 rounded-full w-full text-white px-4"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchQuery !== "" && (
            <div className="absolute w-5/6 bg-gray-800 text-white rounded-2xl shadow-lg max-h-60 overflow-y-auto mt-5 z-50 p-3">
              {searchResults.length === 0 ? (
                <div>Korisnik nije pronađen</div>
              ) : (
                <div>
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="p-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2 mb-0 border-bottom border-gray-700"
                      onClick={() => {
                        if (userId === user?._id) {
                          navigate("/moj-profil");
                        } else {
                          navigate(`/profil/${user._id}`);
                        }
                      }}
                    >
                      <img
                        src={
                          user?.image
                            ? `http://localhost:5000/api/posts/image/${user?.image}`
                            : defaultPic
                        }
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-10 h-10 rounded-full"
                      />
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                      <span>
                        {(() => {
                          switch (user.major) {
                            case "Muzička produkcija":
                              return <img src={muzika} className="w-4" />; // You can return whatever you want for this case
                            case "Odgovorno kodiranje":
                              return <img src={kodiranje} className="w-4" />; // Default case, in case no match
                            case "Novinarstvo":
                              return <img src={novinarstvo} className="w-4" />; // Default case, in case no match
                            case "Kreativno pisanje":
                              return <img src={pisanje} className="w-4" />; // Default case, in case no match
                            case "Grafički dizajn":
                              return <img src={graficki} className="w-4" />; // Default case, in case no match
                          }
                        })()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button className="w-5/6 rounded-full bg-primary text-white tracking-wider cursor-pointer p-3 mt-5">
                <a href="/svi-korisnici">Prikaži sve korisnike</a>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links and Logout Button at the Bottom */}
        <div className="absolute bottom-10 left-20 p-6">
          <ul className="text-2xl w-full">
            <li className="flex items-center gap-x-4 py-2">
              <MessageSquare className="text-primary" size={32} />
              <span className="hover:text-primary cursor-pointer">Chat</span>
            </li>
            <li className="flex items-center gap-x-4 py-2">
              <GraduationCap className="text-primary" size={32} />
              <span className="hover:text-primary cursor-pointer">
                Radionice
              </span>
            </li>
            <li className="flex items-center gap-x-4 py-2">
              <UserPen className="text-primary" size={32} />
              <span className="hover:text-primary cursor-pointer">
                Moj profil
              </span>
            </li>
          </ul>
          <button className="bg-primary p-2 rounded-full w-3/4 mt-10 cursor-pointer">
            Odjavi se
          </button>
        </div>
      </div>

      {/* Hamburger Menu (Mobile Only) */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bottom-0 z-40 p-4 bg-black">
          {/* Search Bar */}
          <div className="text-center my-4">
            <input
              type="text"
              placeholder="Pretraži korisnike..."
              className="border p-3 rounded-full w-full text-white px-4"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchQuery !== "" && (
              <div className="absolute w-9/10 bg-gray-800 text-white rounded-lg shadow-2xl max-h-60 overflow-y-auto mt-5 z-50 p-3">
                {searchResults.length === 0 ? (
                  <div>Korisnik nije pronađen</div>
                ) : (
                  <div>
                    {searchResults.map((user) => (
                      <div
                        key={user._id}
                        className="p-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2 mb-0 border-bottom border-gray-700"
                        onClick={() => {
                          if (userId === user?._id) {
                            navigate(`/moj-profil`);
                          } else {
                            navigate(`/profil/${user._id}`);
                          }
                        }}
                      >
                        <img
                          src={user.image || defaultPic}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-10 h-10 rounded-full"
                        />
                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                        <span>
                          {(() => {
                            switch (user.major) {
                              case "Muzička produkcija":
                                return <img src={muzika} className="w-4" />; // You can return whatever you want for this case
                              case "Odgovorno kodiranje":
                                return <img src={kodiranje} className="w-4" />; // Default case, in case no match
                              case "Novinarstvo":
                                return (
                                  <img src={novinarstvo} className="w-4" />
                                ); // Default case, in case no match
                              case "Kreativno pisanje":
                                return <img src={pisanje} className="w-4" />; // Default case, in case no match
                              case "Grafički dizajn":
                                return <img src={graficki} className="w-4" />; // Default case, in case no match
                            }
                          })()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <button className="w-5/6 rounded-full bg-primary text-white tracking-wider cursor-pointer p-3 mt-5">
                  Prikaži sve korisnike
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center justify-center h-full relative">
            <div className="absolute bottom-35">
              <ul className="text-2xl">
                <li className="flex items-center gap-x-4 py-2">
                  <MessageSquare className="text-primary" size={32} />
                  <span className="hover:text-primary cursor-pointer">
                    Chat
                  </span>
                </li>
                <li className="flex items-center gap-x-4 py-2">
                  <GraduationCap className="text-primary" size={32} />
                  <span className="hover:text-primary cursor-pointer">
                    Radionice
                  </span>
                </li>
                <li className="flex items-center gap-x-4 py-2">
                  <UserPen className="text-primary" size={32} />
                  <span className="hover:text-primary cursor-pointer">
                    Moj profil
                  </span>
                </li>
              </ul>
              <button className="bg-primary p-2 rounded-full w-full mt-10 cursor-pointer">
                Odjavi se
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center gap-4 absolute top-10">
        <div className="mt-25 lg:mt-0">
          <CreatePost userId={userId} refreshFeed={fetchPosts} />
        </div>
        <div>
          {allPosts.map((post) => (
            <Post
              key={post._id}
              profilePic={post.user?.image}
              firstName={post.user.firstName}
              lastName={post.user.lastName}
              content={post.content}
              picture={
                post.image
                  ? `http://localhost:5000/api/posts/image/${post.image}`
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
