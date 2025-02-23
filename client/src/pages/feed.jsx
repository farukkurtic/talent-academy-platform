import hntaLogo from "../assets/hnta-logo.png";
import textLogo from "../assets/textLogo.svg";

import { MessageSquare, GraduationCap, UserPen } from "lucide-react";

import CreatePost from "../components/createPost";

export default function Feed() {
  return (
    <div className="text-white h-screen relative flex items-center justify-center">
      {/* Sidebar */}
      <div className="absolute w-85 top-0 bottom-0 left-0 border-r-1">
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
      <div className="absolute top-10">
        <CreatePost />
      </div>
    </div>
  );
}
