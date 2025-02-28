import { useState } from "react";

import hntaLogo from "../assets/hnta-logo.png";
import textLogo from "../assets/textLogo.svg";
import defaultPic from "../assets/default-image.png";
import defaultBadge from "../assets/default-badge.png";
import randomPic from "../assets/lecture-1.jpg";

import { MessageSquare, GraduationCap, UserPen, Menu } from "lucide-react";

import CreatePost from "../components/createPost";
import Post from "../components/post";

export default function Feed() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu
  return (
    <div className="text-white h-screen relative flex items-center justify-center">
      {/* Header (Mobile Only) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 p-4 flex justify-between items-center border-b border-gray-700 z-50 bg-black">
        {/* Logo Section */}
        <div className="flex items-center">
          <img src={hntaLogo} alt="hnta-logo" className="w-10" />
          <img src={textLogo} alt="hnta-text-logo" className="w-32 h-10 ml-2" />
        </div>

        {/* Hamburger Menu */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu size={32} className="text-primary" />
        </button>
      </div>

      {/* Sidebar (Desktop Only) */}
      <div className="hidden lg:block fixed w-85 top-0 bottom-0 left-0 border-r border-gray-700 bg-black p-6">
        {/* Logo Section */}
        <div className="logo-container flex items-center justify-center">
          <img src={hntaLogo} alt="hnta-logo" className="w-20" />
          <img src={textLogo} alt="hnta-text-logo" className="w-40 h-40 ml-2" />
        </div>

        {/* Search Bar */}
        <div className="text-center my-6">
          <input
            placeholder="Pretraži korisnike..."
            className="border p-3 rounded-full w-full text-white"
          />
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
              placeholder="Pretraži korisnike..."
              className="border p-3 rounded-full w-full bg-gray-700 text-white"
            />
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
        <div>
          <CreatePost />
        </div>
        <div>
          <Post
            profilePic={defaultPic}
            username="Faruk Kurtić"
            badge={defaultBadge}
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec blandit orci. Cras gravida quam fermentum sapien pharetra, quis fringilla mauris gravida. Aenean dui urna, molestie quis lacus sed, finibus commodo quam."
            picture={randomPic}
            gif={"https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif"}
          />
          <Post
            profilePic={defaultPic}
            username="Faruk Kurtić"
            badge={defaultBadge}
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec blandit orci. Cras gravida quam fermentum sapien pharetra, quis fringilla mauris gravida. Aenean dui urna, molestie quis lacus sed, finibus commodo quam."
            picture={randomPic}
          />
          <Post
            profilePic={defaultPic}
            username="Faruk Kurtić"
            badge={defaultBadge}
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec blandit orci. Cras gravida quam fermentum sapien pharetra, quis fringilla mauris gravida. Aenean dui urna, molestie quis lacus sed, finibus commodo quam."
            gif={"https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif"}
          />
        </div>
      </div>
    </div>
  );
}
