import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";

import hntaLogo from "../assets/logos/hnta-logo.png";
import textLogo from "../assets/logos/textLogo.svg";

import {
  MessageSquare,
  GraduationCap,
  UserPen,
  Menu,
  Plus,
} from "lucide-react";

import Workshop from "../components/workshop";

import kodiranje from "../assets/badges/kodiranje.svg";
import pisanje from "../assets/badges/kreativnoPisanje.svg";
import graficki from "../assets/badges/grafickiDizajn.svg";
import novinarstvo from "../assets/badges/novinarstvo.svg";
import muzika from "../assets/badges/muzickaProdukcija.svg";

import defaultPic from "../assets/defaults/defaultPic.svg";

export default function Radionice() {
  const [userId, setUserId] = useState(null);
  const [workshops, setWorkshops] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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

  useEffect(() => {
    if (userId) {
      fetchWorkshops();
    }
  }, [userId]);

  const fetchWorkshops = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/workshop");
      setWorkshops(response.data.workshop);
    } catch (err) {
      console.error("Error fetching workshops:", err);
    }
  };

  const myWorkshops = workshops.filter(
    (workshop) => workshop.createdBy === userId
  );
  const attendingWorkshops = workshops.filter((workshop) =>
    workshop.attendes.includes(userId)
  );
  const allWorkshops = workshops;

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/prijava");
  };

  return (
    <div className="text-white min-h-screen relative flex">
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
                        if (userId === user?._id) {
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
                <a href="/filteri">Prikaži sve korisnike</a>
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
            className="bg-primary p-2 rounded-full w-3/4 mt-10 cursor-pointer"
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
                          if (userId === user?._id) {
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
                <a href="svi-korisnici">
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
                className="bg-primary p-2 rounded-full w-full mt-10 cursor-pointer"
                onClick={handleLogout}
              >
                Odjavi se
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 lg:ml-85 pt-16 lg:pt-0 overflow-y-auto">
        <div className="flex justify-end p-6">
          <Link
            to="/kreiraj-radionicu"
            className="bg-primary px-6 py-3 rounded-full flex items-center gap-2"
          >
            <Plus size={20} />
            Kreiraj radionicu
          </Link>
        </div>
        <h1 className="text-2xl border-b border-t border-gray-700 font-bold p-4 mb-6 tracking-wider">
          Moje radionice
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 mx-auto">
          {myWorkshops.length === 0 ? (
            <p className="text-xl">Nemate kreiranih radionica</p>
          ) : (
            myWorkshops.map((workshop) => (
              <Workshop
                key={workshop._id}
                imageId={workshop.coverImage}
                title={workshop.name}
                description={workshop.details}
                date={new Date(workshop.dateOfStart).toLocaleString()}
                createdBy={workshop.createdBy}
                onClick={() => navigate(`/radionice/${workshop._id}`)}
              />
            ))
          )}
        </div>
        <h1 className="text-2xl border-b border-gray-700 font-bold p-4 mb-6 tracking-wider">
          Nadolazeće radionice
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6  mx-auto">
          {attendingWorkshops.length === 0 ? (
            <p className="text-left mr-auto text-xl">
              Nemate nadolazećih radionica
            </p>
          ) : (
            attendingWorkshops.map((workshop) => (
              <Workshop
                key={workshop._id}
                imageId={workshop.coverImage}
                title={workshop.name}
                description={workshop.details}
                date={new Date(workshop.dateOfStart).toLocaleString()}
                createdBy={workshop.createdBy}
                onClick={() => navigate(`/radionice/${workshop._id}`)}
              />
            ))
          )}
        </div>
        <h1 className="text-2xl border-b border-t border-gray-700 font-bold p-4 mb-6 tracking-wider">
          Sve radionice
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 mx-auto">
          {allWorkshops.length === 0 ? (
            <p className="text-left mr-auto text-xl">
              Radionice nisu pronađene
            </p>
          ) : (
            allWorkshops.map((workshop) => (
              <Workshop
                key={workshop._id}
                imageId={workshop.coverImage}
                title={workshop.name}
                description={workshop.details}
                date={new Date(workshop.dateOfStart).toLocaleString()}
                createdBy={workshop.createdBy}
                onClick={() => navigate(`/radionice/${workshop._id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
