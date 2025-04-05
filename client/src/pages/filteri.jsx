/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import hntaLogo from "../assets/logos/hnta-logo.png";
import textLogo from "../assets/logos/textLogo.svg";
import defaultPic from "../assets/defaults/defaultPic.svg";

import kodiranje from "../assets/badges/kodiranje.svg";
import pisanje from "../assets/badges/kreativnoPisanje.svg";
import graficki from "../assets/badges/grafickiDizajn.svg";
import novinarstvo from "../assets/badges/novinarstvo.svg";
import muzika from "../assets/badges/muzickaProdukcija.svg";

import line1 from "../assets/lines/s1.svg";
import line2 from "../assets/lines/s2.svg";

import { MessageSquare, GraduationCap, UserPen, Menu } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Filters() {
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    major: [],
    purposeOfPlatform: [],
    yearOfAttend: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/prijava");
    } else {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }

    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/`);
      setAllUsers(response.data.users);
      setFilteredUsers(response.data.users.results);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
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

  const handleFilterChange = (type, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (type === "yearOfAttend") {
        const isSelected = updatedFilters[type].includes(value);
        updatedFilters[type] = isSelected
          ? updatedFilters[type].filter((item) => item !== value)
          : [...updatedFilters[type], value];
      } else {
        const isSelected = updatedFilters[type].includes(value);
        updatedFilters[type] = isSelected
          ? updatedFilters[type].filter((item) => item !== value)
          : [...updatedFilters[type], value];
      }
      return updatedFilters;
    });
  };

  const applyFilters = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.major.length > 0) {
        queryParams.append("major", filters.major.join(","));
      }
      if (filters.purposeOfPlatform.length > 0) {
        queryParams.append(
          "purposeOfPlatform",
          filters.purposeOfPlatform.join(",")
        );
      }
      if (filters.yearOfAttend) {
        queryParams.append("yearOfAttend", filters.yearOfAttend);
      }
      const response = await axios.get(
        `${API_URL}/api/user/filter?${queryParams.toString()}`
      );
      setFilteredUsers(response.data.users);
    } catch (err) {
      console.error("Error applying filters:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/prijava");
  };

  return (
    <div className="text-white h-screen relative flex flex-col lg:flex-row">
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
      <div className="lg:hidden fixed top-0 left-0 right-0 p-4 flex justify-between items-center border-b border-gray-700 z-50 bg-black">
        <div className="flex items-center">
          <img src={hntaLogo} alt="hnta-logo" className="w-10" />
          <img src={textLogo} alt="hnta-text-logo" className="w-32 h-10 ml-2" />
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu size={32} className="text-primary" />
        </button>
      </div>
      <div className="w-85 lg:ml-100 lg:h-screen hidden lg:block lg:p-6 flex flex-col lg:flex-row border-r border-gray-700 overflow-y-auto scrollbar-hide">
        <div className="mb-6 w-full">
          <h3 className="text-xl font-semibold mb-5 tracking-wider">
            Smjerovi
          </h3>
          {[
            "Odgovorno kodiranje",
            "Kreativno pisanje",
            "Muzička produkcija",
            "Grafički dizajn",
            "Novinarstvo",
          ].map((major) => (
            <label
              key={major}
              className="flex items-center mb-4 border border-1 p-2 rounded-full w-3/4"
            >
              <input
                type="checkbox"
                checked={filters.major.includes(major)}
                onChange={() => handleFilterChange("major", major)}
                className="mr-2 accent-primary"
              />
              {major}
            </label>
          ))}
        </div>
        <div className="mb-6 w-full">
          <h3 className="text-xl font-semibold mb-5 tracking-wider">
            Dostupan za
          </h3>
          {["Networking", "Skill sharing", "Mentorship"].map((purpose) => (
            <label
              key={purpose}
              className="flex items-center mb-4 border border-1 p-2 rounded-full w-3/4"
            >
              <input
                type="checkbox"
                checked={filters.purposeOfPlatform.includes(purpose)}
                onChange={() =>
                  handleFilterChange("purposeOfPlatform", purpose)
                }
                className="mr-2 accent-primary"
              />
              {purpose}
            </label>
          ))}
        </div>
        <div className="mb-6 w-full">
          <h3 className="text-xl font-semibold mb-5 tracking-wider">
            Generacija
          </h3>
          {["2024", "2025"].map((year) => (
            <label
              key={year}
              className="flex items-center mb-4 border border-1 p-2 rounded-full w-3/4"
            >
              <input
                type="checkbox"
                checked={filters.yearOfAttend.includes(year)}
                onChange={() => handleFilterChange("yearOfAttend", year)}
                className="mr-2 accent-primary"
              />
              {year}
            </label>
          ))}
        </div>
        <button
          onClick={applyFilters}
          className="bg-primary p-2 rounded-full w-3/4 text-white cursor-pointer"
        >
          Filtriraj
        </button>
      </div>
      <div className="flex-1 p-6 overflow-y-auto max-h-screen relative w-full">
        <img
          src={line1}
          className="fixed -bottom-20 -right-10 rotate-250 hidden lg:block w-2xs"
        />
        <img
          src={line2}
          className="fixed top-0 right-0 rotate-100 hidden lg:block w-xs"
        />
        <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start mt-20 lg:mt-0 w-full">
          {filteredUsers?.map((user) => (
            <a
              key={user._id}
              href={user._id === userId ? "/moj-profil" : `/profil/${user._id}`}
              className="cursor-pointer"
            >
              <div className="p-4 border border-gray-700 rounded-3xl mb-10 w-90 lg:w-120">
                <img
                  crossOrigin="anonymous"
                  src={
                    user?.image
                      ? `${API_URL}/api/posts/image/${user?.image}`
                      : defaultPic
                  }
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-20 h-20 rounded-full mb-4"
                />
                <div className="flex items-center mb-4">
                  <h3 className="text-3xl font-semibold mr-4">
                    {user.firstName} {user.lastName}
                  </h3>
                  {(() => {
                    switch (user.major) {
                      case "Muzička produkcija":
                        return <img src={muzika} className="w-6" />;
                      case "Odgovorno kodiranje":
                        return <img src={kodiranje} className="w-6" />;
                      case "Novinarstvo":
                        return <img src={novinarstvo} className="w-6" />;
                      case "Kreativno pisanje":
                        return <img src={pisanje} className="w-6" />;
                      case "Grafički dizajn":
                        return <img src={graficki} className="w-6" />;
                    }
                  })()}
                </div>
                <p className="break-words">
                  {user?.biography.length > 250
                    ? user.biography.slice(0, 250) + "..."
                    : user?.biography}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bottom-0 z-40 p-4 bg-black min-h-screen overflow-auto">
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
                <button className="w-5/6 rounded-full bg-primary text-white tracking-wider cursor-pointer p-3 mt-5">
                  <a href="/svi-korisnici">Prikaži sve korisnike</a>
                </button>
              </div>
            )}
          </div>
          <div className=" p-6 flex flex-col items-center justify-center w-full">
            <div className="mb-6 w-full text-center flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-5 tracking-wider">
                Smjerovi
              </h3>
              {[
                "Odgovorno kodiranje",
                "Kreativno pisanje",
                "Muzička produkcija",
                "Grafički dizajn",
                "Novinarstvo",
              ].map((major) => (
                <label
                  key={major}
                  className="flex items-center mb-4 border border-1 p-2 rounded-full w-3/4"
                >
                  <input
                    type="checkbox"
                    checked={filters.major.includes(major)}
                    onChange={() => handleFilterChange("major", major)}
                    className="mr-2 accent-primary"
                  />
                  {major}
                </label>
              ))}
            </div>
            <div className="mb-6 w-full text-center flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-5 tracking-wider">
                Dostupan za
              </h3>
              {["Networking", "Skill sharing", "Mentorship"].map((purpose) => (
                <label
                  key={purpose}
                  className="flex items-center mb-4 border border-1 p-2 rounded-full w-3/4"
                >
                  <input
                    type="checkbox"
                    checked={filters.purposeOfPlatform.includes(purpose)}
                    onChange={() =>
                      handleFilterChange("purposeOfPlatform", purpose)
                    }
                    className="mr-2 accent-primary"
                  />
                  {purpose}
                </label>
              ))}
            </div>
            <div className="mb-6 w-full text-center flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-5 tracking-wider">
                Generacija
              </h3>
              {["2024", "2025"].map((year) => (
                <label
                  key={year}
                  className="flex items-center mb-4 border border-1 p-2 rounded-full w-3/4"
                >
                  <input
                    type="checkbox"
                    checked={filters.yearOfAttend.includes(year)}
                    onChange={() => handleFilterChange("yearOfAttend", year)}
                    className="mr-2 accent-primary"
                  />
                  {year}
                </label>
              ))}
            </div>
            <button
              onClick={applyFilters}
              className="bg-primary p-2 rounded-full w-3/4 text-white cursor-pointer mb-20"
            >
              Filtriraj
            </button>
          </div>
          <div className="flex flex-col items-center justify-center relative h-1/2">
            <div className="absolute bottom-20">
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
                <button
                  className="bg-primary p-2 rounded-full w-full mt-10 cursor-pointer tracking-wider"
                  onClick={handleLogout}
                >
                  Odjavi se
                </button>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
