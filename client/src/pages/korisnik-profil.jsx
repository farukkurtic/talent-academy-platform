import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  MessageSquare,
  GraduationCap,
  UserPen,
  Menu,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Globe,
} from "lucide-react";

import hntaLogo from "../assets/hnta-logo.png";
import textLogo from "../assets/textLogo.svg";
import defaultPic from "../assets/defaultPic.svg";
import badge from "../assets/default-badge.png";
import line1 from "../assets/lines/s1.svg";
import line2 from "../assets/lines/s4.svg";
import line3 from "../assets/lines/s3.svg";

export default function Profile() {
  const { userId } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu

  return (
    <div className="text-white h-screen relative flex flex-col lg:flex-row lg:items-center lg:justify-center">
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
              className="border p-3 rounded-full w-full text-white"
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

      {/* Profile Info */}
      <div className="flex-1 lg:ml-80 p-8 lg:p-15 mt-16 lg:mt-0 mb-8 relative">
        <img
          src={line1}
          className="hidden lg:block lg:absolute lg:-top-70 lg:right-0 lg:rotate-180"
        />
        <img
          src={line3}
          className="hidden lg:block lg:absolute lg:-bottom-26 lg:left-0 lg:rotate-180"
        />
        <img
          src={line2}
          className="hidden lg:block lg:absolute lg:-top-19 lg:left-5 scale-x-[-1] "
        />

        <div className="flex flex-col items-center lg:items-start">
          <img src={defaultPic} className="w-35 h-35 mb-10" alt="Profile" />
          <div className="flex items-center">
            <h1 className="text-3xl lg:text-5xl tracking-wider font-semibold mr-4">
              Faruk Kurtić
            </h1>
            <img src={badge} className="w-9" alt="Badge" />
          </div>
          <div className="mt-15 flex flex-col lg:flex-row gap-6 w-full">
            <div className="w-full lg:w-1/4 tracking-wider">
              <div className="border rounded-full p-3 w-full mb-5">Smjer:</div>
              <div className="border rounded-full p-3 w-full mb-5">
                Godina pohađanja:
              </div>
              <div className="border rounded-full p-3 w-full mb-5">
                Zanimanje:
              </div>
            </div>

            {/* Bio Section */}
            <div className="w-full lg:w-1/3">
              <div className="border rounded-xl p-4 w-full h-95 lg:h-80">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
                commodo ligula eget dolor. Aenean massa. Cum sociis natoque
                penatibus et magnis dis parturient montes, nascetur ridiculus
                mus. Donec quam felis, ultricies nec, pellentesque eu, pretium
                quis, sem. Nulla consequat massa quis enim. Donec pede justo,
                fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo,
                rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum
                felis eu pede mollis pretium. Integer tincidunt. Cras dapibu
              </div>
            </div>

            {/* Social Media Links */}
            <div className="w-full lg:w-1/3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border rounded-full p-3 cursor-pointer flex items-center justify-center lg:justify-start">
                  <Instagram className="mr-3 hover:text-primary" />
                  Instagram
                </div>
                <div className="border rounded-full p-3 cursor-pointer flex items-center justify-center lg:justify-start">
                  <Facebook className="mr-3 hover:text-primary" />
                  Facebook
                </div>
                <div className="border rounded-full p-3 cursor-pointer flex items-center justify-center lg:justify-start">
                  <Twitter className="mr-3 hover:text-primary" />X
                </div>
                <div className="border rounded-full p-3 cursor-pointer flex items-center justify-center lg:justify-start">
                  <Linkedin className="mr-3 hover:text-primary" />
                  LinkedIn
                </div>
                <div className="border rounded-full p-3 cursor-pointer flex items-center justify-center lg:justify-start col-span-1 lg:col-span-2">
                  <Globe className="mr-3 hover:text-primary" />
                  Web
                </div>
                {/* Javi se Button */}
                <div className="col-span-1 lg:col-span-2">
                  <button className="text-white rounded-full bg-primary p-3 w-full cursor-pointer font-bold tracking-wider">
                    Javi se!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
