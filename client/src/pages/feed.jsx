import hntaLogo from "../assets/hnta-logo.png";
import textLogo from "../assets/textLogo.svg";
import defaultPic from "../assets/default-image.png";
import defaultBadge from "../assets/default-badge.png";
import randomPic from "../assets/lecture-1.jpg";

import { MessageSquare, GraduationCap, UserPen } from "lucide-react";

import CreatePost from "../components/createPost";
import Post from "../components/post";

export default function Feed() {
  return (
    <div className="text-white h-screen relative flex items-center justify-center">
      {/* Sidebar */}
      <div className="fixed w-85 top-0 bottom-0 left-0 border-r-1">
        {/* Logo Section */}
        <div className="logo-container flex items-center justify-center">
          <img src={hntaLogo} alt="hnta-logo" className="w-20" />
          <img src={textLogo} alt="hnta-text-logo" className="w-50 h-50" />
        </div>

        {/* Search Bar */}
        <div className="text-center my-4">
          <input
            placeholder="Pretraži korisnike..."
            className="border p-3 rounded-full w-3/4"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center justify-center absolute bottom-20 left-25">
          <ul className="text-2xl ">
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
