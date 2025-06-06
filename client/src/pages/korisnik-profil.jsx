import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Modal from "react-modal";
import axios from "axios";

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
  X,
} from "lucide-react";

import hntaLogo from "../assets/logos/hnta-logo.png";
import textLogo from "../assets/logos/textLogo.svg";
import defaultPic from "../assets/defaults/defaultPic.svg";

import line1 from "../assets/lines/s1.svg";
import line5 from "../assets/lines/s5.svg";

import kodiranje from "../assets/badges/kodiranje.svg";
import pisanje from "../assets/badges/kreativnoPisanje.svg";
import graficki from "../assets/badges/grafickiDizajn.svg";
import novinarstvo from "../assets/badges/novinarstvo.svg";
import muzika from "../assets/badges/muzickaProdukcija.svg";

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const badges = {
    "Odgovorno kodiranje": kodiranje,
    "Kreativno pisanje": pisanje,
    "Grafički dizajn": graficki,
    Novinarstvo: novinarstvo,
    "Muzička produkcija": muzika,
  };

  const [currentUserId, setCurrentUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const paramsId = params.userId;

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      try {
        const response = await axios.get(
          `${API_URL}/api/user/search?name=${query}`
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
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/prijava");
    } else {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.id);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/id/${paramsId}`);
        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    if (paramsId) {
      fetchUser();
    }
  }, [paramsId]);

  const userMajor = userData?.major;
  const badgeImage = badges[userMajor];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/prijava");
  };

  return (
    <div className="text-white min-h-screen relative flex flex-col lg:flex-row lg:items-center lg:justify-center">
      <div className="lg:hidden fixed top-0 left-0 right-0 p-4 flex justify-between items-center border-b border-gray-700 z-50 bg-black">
        <a href="/feed">
          <div className="flex items-center">
            <img src={hntaLogo} alt="hnta-logo" className="w-10" />
            <img
              src={textLogo}
              alt="hnta-text-logo"
              className="w-32 h-10 ml-2"
            />
          </div>
        </a>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu size={32} className="text-primary" />
        </button>
      </div>
      <div className="hidden lg:block fixed w-85 top-0 bottom-0 left-0 border-r border-gray-700 bg-black p-6">
        <a href="/feed">
          <div className="logo-container flex items-center justify-center">
            <img src={hntaLogo} alt="hnta-logo" className="w-20" />
            <img
              src={textLogo}
              alt="hnta-text-logo"
              className="w-40 h-40 ml-2"
            />
          </div>
        </a>
        <div className="text-center my-6">
          <input
            type="text"
            placeholder="Pretraži korisnike..."
            className="border p-3 rounded-full w-full text-white px-4"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {(isSearchFocused || searchQuery !== "") && (
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
                        if (currentUserId === user?._id) {
                          navigate("/moj-profil");
                        } else {
                          navigate(`/profil/${user._id}`);
                        }
                      }}
                    >
                      <img
                        crossOrigin="anonymous"
                        src={
                          user?.image
                            ? `${API_URL}/api/posts/image/${user?.image}`
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
                  ))}
                </div>
              )}
              <button className="w-5/6 rounded-full bg-primary text-white tracking-wider cursor-pointer p-3 mt-5">
                <a href="/svi-korisnici">Prikaži sve korisnike</a>
              </button>
            </div>
          )}
        </div>
        <div className="absolute bottom-10 left-20 p-6">
          <ul className="text-2xl w-full">
            <li className="flex items-center gap-x-4 py-2">
              <MessageSquare className="text-primary" size={32} />
              <a href="/chat">
                <span className="hover:text-primary cursor-pointer">Chat</span>
              </a>
            </li>
            <li className="flex items-center gap-x-4 py-2">
              <GraduationCap className="text-primary" size={32} />
              <a href="/radionice">
                <span className="hover:text-primary cursor-pointer">
                  Radionice
                </span>
              </a>
            </li>
            <li className="flex items-center gap-x-4 py-2">
              <UserPen className="text-primary" size={32} />
              <a href="/moj-profil">
                <span className="hover:text-primary cursor-pointer">
                  Moj profil
                </span>
              </a>
            </li>
          </ul>
          <button
            className="bg-primary p-2 rounded-full w-3/4 mt-10 cursor-pointer tracking-wider"
            onClick={handleLogout}
          >
            Odjavi se
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bottom-0 z-40 p-4 bg-black">
          <div className="text-center my-4">
            <input
              type="text"
              placeholder="Pretraži korisnike..."
              className="border p-3 rounded-full w-full text-white px-4"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {(isSearchFocused || searchQuery !== "") && (
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
                          if (currentUserId === user?._id) {
                            navigate("/moj-profil");
                          } else {
                            navigate(`/profil/${user._id}`);
                          }
                        }}
                      >
                        <img
                          crossOrigin="anonymous"
                          src={
                            user?.image
                              ? `${API_URL}/api/posts/image/${user?.image}`
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
                    ))}
                  </div>
                )}
                <a href="/svi-korisnici">
                  <button className="w-5/6 rounded-full bg-primary text-white tracking-wider cursor-pointer p-3 mt-5">
                    Prikaži sve korisnike
                  </button>
                </a>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center h-full relative">
            <div className="absolute bottom-35">
              <ul className="text-2xl">
                <li className="flex items-center gap-x-4 py-2">
                  <MessageSquare className="text-primary" size={32} />
                  <a href="/chat">
                    <span className="hover:text-primary cursor-pointer">
                      Chat
                    </span>
                  </a>
                </li>
                <li className="flex items-center gap-x-4 py-2">
                  <GraduationCap className="text-primary" size={32} />
                  <a href="/radionice">
                    <span className="hover:text-primary cursor-pointer">
                      Radionice
                    </span>
                  </a>
                </li>
                <li className="flex items-center gap-x-4 py-2">
                  <UserPen className="text-primary" size={32} />
                  <a href="/moj-profil">
                    <span className="hover:text-primary cursor-pointer">
                      Moj profil
                    </span>
                  </a>
                </li>
              </ul>
              <button
                className="bg-primary p-2 rounded-full w-full mt-10 cursor-pointer tracking-wider"
                onClick={handleLogout}
              >
                Odjavi se
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
        ariaHideApp={false}
      >
        <div className="bg-black p-4 rounded-lg relative">
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 p-1 rounded-full bg-gray-200 transition-colors"
          >
            <X size={24} className="text-gray-700" />
          </button>
          <img
            crossOrigin="anonymous"
            src={`${API_URL}/api/posts/image/${userData?.image}`}
            alt="Expanded"
            className="max-w-full max-h-[90vh] rounded-lg"
          />
        </div>
      </Modal>
      <div className="flex-1 lg:ml-80 p-8 mt-30 lg:mt-0 mb-8 relative overflow-x-hidden">
        <img
          src={line1}
          className="hidden lg:block lg:absolute lg:-top-40 lg:-right-0 lg:rotate-180"
        />
        <img
          src={line5}
          className="hidden lg:block lg:absolute lg:bottom-0 lg:-right-65"
        />
        <div className="flex flex-col items-center justify-center lg:items-start lg:ml-40">
          <img
            crossOrigin="anonymous"
            src={
              userData?.image
                ? `${API_URL}/api/posts/image/${userData?.image}`
                : defaultPic
            }
            className="w-40 h-40 mb-10 rounded-full"
            alt="Profile"
            onClick={() => openModal()}
          />
          <div className="flex items-center">
            <h1 className="text-3xl lg:text-5xl tracking-wider font-semibold mr-4">
              {userData
                ? `${userData.firstName} ${userData.lastName}`
                : "Učitava se..."}
            </h1>
            <img src={badgeImage} className="w-9" alt="Badge" />
          </div>
          <div className="mt-15 flex w-full items-center justify-center">
            <div className="w-full tracking-wider lg:mr-15 flex flex-col text-center">
              <div className="flex flex-col lg:flex-row w-full">
                <div className="mr-15 mb-15 w-full lg:w-1/4">
                  <h1 className="text-3xl text-primary tracking-wider mb-10 text-center lg:text-left">
                    Informacije
                  </h1>
                  <div className="border rounded-full p-3 w-full mb-5">
                    Smjer: {userData?.major}
                  </div>
                  <div className="border rounded-full p-3 w-full mb-5">
                    Godina pohađanja: {userData?.yearOfAttend}
                  </div>
                  <div className="border rounded-full p-3 w-full mb-5">
                    Zanimanje: {userData?.profession}
                  </div>
                </div>
                <div className="w-full lg:w-1/3 text-center lg:text-left">
                  {userData?.links &&
                    userData.links.some((link) => link.url !== "") && (
                      <h1 className="text-3xl text-primary tracking-wider mb-10">
                        Linkovi
                      </h1>
                    )}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-15 lg:mg-0">
                    {userData?.links.map((fullLink) => {
                      if (fullLink.url !== "") {
                        switch (fullLink.platform) {
                          case "instagram":
                            return (
                              <a href={fullLink.url}>
                                <div className="border rounded-full p-3 cursor-pointer flex items-center justify-center lg:justify-start w-full">
                                  <Instagram className="mr-3 hover:text-primary" />
                                  Instagram
                                </div>
                              </a>
                            );
                          case "facebook":
                            return (
                              <a href={fullLink.ur}>
                                <div className="border rounded-full p-3 cursor-pointer flex items-center justify-center lg:justify-start">
                                  <Facebook className="mr-3 hover:text-primary" />
                                  Facebook
                                </div>
                              </a>
                            );
                          case "twitter":
                            return (
                              <a href={fullLink.url}>
                                <div className="border rounded-full p-3 cursor-pointer flex items-center justify-center lg:justify-start">
                                  <Twitter className="mr-3 hover:text-primary" />
                                  Twitter
                                </div>
                              </a>
                            );
                          case "linkedin":
                            return (
                              <a href={fullLink.url}>
                                <div className="border rounded-full p-3 cursor-pointer flex items-center justify-center lg:justify-start">
                                  <Linkedin className="mr-3 hover:text-primary" />
                                  LinkedIn
                                </div>
                              </a>
                            );
                          case "web":
                            return (
                              <a href={fullLink.url}>
                                <div className="border rounded-full p-3 cursor-pointer flex items-center justify-center lg:justify-start">
                                  <Globe className="mr-3 hover:text-primary" />
                                  Web
                                </div>
                              </a>
                            );
                        }
                      }
                    })}
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 lg:mr-15 mb-15">
                <h1 className="text-3xl text-primary tracking-wider mb-10 text-center lg:text-left">
                  Biografija
                </h1>
                <div className="border rounded-xl p-4 w-full min-h-50 lg:min-h-50 text-left">
                  <p className="whitespace-pre-wrap break-words">
                    {userData?.biography}
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-1/2 lg:mr-15">
                <h1 className="text-3xl text-primary tracking-wider mb-10 text-center lg:text-left">
                  Dostupan za:
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4  lg:mg-0">
                  {userData?.purposeOfPlatform.map((item) => {
                    return (
                      <div key={item} className="rounded-full p-3 border">
                        <p>{item}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <button
            className="text-white rounded-full bg-primary p-3 w-full lg:w-2/8 cursor-pointer font-bold tracking-wider mt-10"
            onClick={() => {
              navigate("/chat", { state: { selectedUser: userData } });
            }}
          >
            Javi se!
          </button>
        </div>
      </div>
    </div>
  );
}
