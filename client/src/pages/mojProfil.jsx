import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
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

const validationSchema = Yup.object().shape({
  major: Yup.string().required("Ovo polje je obavezno"),
  yearOfAttend: Yup.string().required("Ovo polje je obavezno"),
  profession: Yup.string().required("Ovo polje je obavezno"),
  biography: Yup.string()
    .max(500, "Biografija ne smije biti duža od 500 znakova")
    .required("Ovo polje je obavezno"),
  purposeOfPlatform: Yup.array()
    .min(1, "Odaberite barem jednu opciju")
    .required("Ovo polje je obavezno"),
});

export default function MyProfile() {
  const badges = {
    "Odgovorno kodiranje": kodiranje,
    "Kreativno pisanje": pisanje,
    "Grafički dizajn": graficki,
    Novinarstvo: novinarstvo,
    "Muzička produkcija": muzika,
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [bioLength, setBioLength] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      purposeOfPlatform: [],
      major: "",
      yearOfAttend: "",
      profession: "",
      biography: "",
      links: [
        { platform: "instagram", url: "" },
        { platform: "facebook", url: "" },
        { platform: "twitter", url: "" },
        { platform: "linkedin", url: "" },
        { platform: "web", url: "" },
      ],
    },
  });

  const biography = watch("biography", "");
  useEffect(() => {
    setBioLength(biography.length);
  }, [biography]);

  const getIcon = (platform) => {
    switch (platform) {
      case "instagram":
        return (
          <Instagram className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        );
      case "facebook":
        return (
          <Facebook className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        );
      case "twitter":
        return (
          <Twitter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        );
      case "linkedin":
        return (
          <Linkedin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        );
      case "web":
        return (
          <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        );
      default:
        return null;
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

  const openModal = () => setIsModalOpen(true);

  const [profileImage, setProfileImage] = useState(null);

  const navigate = useNavigate();

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
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/id/${currentUserId}`
        );
        const user = response.data.user;
        reset({
          purposeOfPlatform: user.purposeOfPlatform || [],
          major: user.major,
          yearOfAttend: user.yearOfAttend,
          profession: user.profession,
          biography: user.biography,
          links: user.links,
        });
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (currentUserId) {
      fetchUser();
    }
  }, [currentUserId, reset]);

  const handlePurposeChange = (value) => {
    const currentPurposes = watch("purposeOfPlatform");
    const updatedPurposes = currentPurposes.includes(value)
      ? currentPurposes.filter((purpose) => purpose !== value)
      : [...currentPurposes, value];
    setValue("purposeOfPlatform", updatedPurposes);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      const newImagePreviewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(newImagePreviewUrl);
      setProfileImage(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("major", data.major);
      formDataToSend.append("yearOfAttend", data.yearOfAttend);
      formDataToSend.append("profession", data.profession);
      formDataToSend.append("biography", data.biography);
      formDataToSend.append("links", JSON.stringify(data.links));
      formDataToSend.append(
        "purposeOfPlatform",
        JSON.stringify(data.purposeOfPlatform)
      );
      if (profileImage) {
        formDataToSend.append("image", profileImage);
      }

      const response = await axios.put(
        `http://localhost:5000/api/user/${currentUserId}/currentUser`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUserData(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

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
                className="bg-primary p-2 rounded-full w-full mt-10 cursor-pointer"
                onClick={handleLogout}
              >
                Odjavi se
              </button>
            </div>
          </div>
        </div>
      )}
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
          <div className="relative">
            <img
              crossOrigin="anonymous"
              src={
                imagePreviewUrl ||
                (userData?.image
                  ? `http://localhost:5000/api/posts/image/${userData?.image}`
                  : defaultPic)
              }
              className="w-40 h-40 mb-10 rounded-full cursor-pointer"
              alt="Profile"
              onClick={
                isEditing
                  ? () => document.getElementById("profile-image-input").click()
                  : openModal
              }
            />
            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer"
                  id="profile-image-input"
                  style={{ display: "none" }}
                />
              </>
            )}
          </div>
          <div className="flex items-center">
            <h1 className="text-3xl lg:text-5xl tracking-wider font-semibold mr-4">
              {userData
                ? `${userData.firstName} ${userData.lastName}`
                : "Učitava se..."}
            </h1>
            <img src={badgeImage} className="w-9" alt="Badge" />
          </div>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="mt-15 flex w-full items-center justify-center">
                <div className="w-full tracking-wider lg:mr-15 flex flex-col">
                  <div className="flex flex-col lg:flex-row w-full">
                    <div className="mr-15 mb-15 w-full lg:w-1/4">
                      <h1 className="text-3xl text-primary tracking-wider mb-10 text-center lg:text-left">
                        Informacije
                      </h1>
                      <select
                        {...register("major")}
                        className="w-full p-4 placeholder-white mb-5 mt-1 border rounded rounded-full bg-transparent text-white appearance-none"
                      >
                        <option
                          value=""
                          disabled
                          selected
                          className="bg-gray-800 text-white"
                        >
                          Odaberite smjer
                        </option>
                        <option
                          value="Kreativno pisanje"
                          className="bg-gray-800"
                        >
                          Kreativno pisanje
                        </option>
                        <option value="Grafički dizajn" className="bg-gray-800">
                          Grafički dizajn
                        </option>
                        <option value="Novinarstvo" className="bg-gray-800">
                          Novinarstvo
                        </option>
                        <option
                          value="Muzička produkcija"
                          className="bg-gray-800"
                        >
                          Muzička produkcija
                        </option>
                        <option
                          value="Odgovorno kodiranje"
                          className="bg-gray-800"
                        >
                          Odgovorno kodiranje
                        </option>
                      </select>
                      {errors.major && (
                        <p className="text-red-500 text-sm mb-5">
                          {errors.major.message}
                        </p>
                      )}
                      <select
                        {...register("yearOfAttend")}
                        className="w-full p-4 placeholder-white mb-5 mt-1 border rounded rounded-full bg-transparent text-white appearance-none"
                      >
                        <option
                          value=""
                          disabled
                          selected
                          className="bg-gray-800"
                        >
                          Odaberite godinu
                        </option>
                        <option value={2024} className="bg-gray-800">
                          2024
                        </option>
                        <option value={2025} className="bg-gray-800">
                          2025
                        </option>
                      </select>
                      {errors.yearOfAttend && (
                        <p className="text-red-500 text-sm mb-5">
                          {errors.yearOfAttend.message}
                        </p>
                      )}
                      <input
                        {...register("profession")}
                        className="border rounded-full p-4 w-full mb-5 bg-transparent text-white"
                        placeholder="Zanimanje"
                      />
                      {errors.profession && (
                        <p className="text-red-500 mr-2">
                          {errors.profession.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full lg:w-1/3 text-center lg:text-left">
                      <h1 className="text-3xl text-primary tracking-wider mb-10">
                        Linkovi
                      </h1>
                      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mb-15 ">
                        {watch("links").map((link, index) => (
                          <div key={link.platform} className="relative">
                            {getIcon(link.platform)}
                            <input
                              {...register(`links.${index}.url`)}
                              className="w-full border rounded-full p-3 bg-transparent text-white pl-12"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 lg:mr-15 mb-15">
                    <h1 className="text-3xl text-primary tracking-wider mb-10 text-center lg:text-left">
                      Dostupan za:
                    </h1>
                    <div className="flex flex-wrap gap-3">
                      {["Networking", "Skill sharing", "Mentorship"].map(
                        (purpose) => (
                          <label
                            key={purpose}
                            className="border rounded-full p-2 flex items-center"
                          >
                            <input
                              type="checkbox"
                              value={purpose}
                              checked={watch("purposeOfPlatform").includes(
                                purpose
                              )}
                              onChange={() => handlePurposeChange(purpose)}
                              className="mr-2 accent-primary"
                            />
                            {purpose}
                          </label>
                        )
                      )}
                    </div>
                    {errors.purposeOfPlatform && (
                      <p className="text-red-500 mt-3">
                        {errors.purposeOfPlatform.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full lg:w-1/2 lg:mr-15 mb-15">
                    <h1 className="text-3xl text-primary tracking-wider mb-10 text-center lg:text-left">
                      Biografija
                    </h1>
                    <textarea
                      {...register("biography")}
                      className="border rounded-xl p-4 w-full min-h-90 lg:min-h-70 bg-transparent text-white mb-3"
                      placeholder="Biografija"
                      maxLength={500}
                      onChange={(e) => {
                        setValue("biography", e.target.value);
                        setBioLength(e.target.value.length);
                      }}
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      Preostalo karaktera: {500 - bioLength}
                    </p>
                    {errors.biography && (
                      <p className="text-red-500">{errors.biography.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="text-white rounded-full bg-primary p-3 w-full lg:w-2/8 cursor-pointer font-bold tracking-wider mt-10"
                  >
                    Spremi
                  </button>
                </div>
              </div>
            </form>
          ) : (
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
                      {userData?.links.map((link) => {
                        if (link.url !== "") {
                          switch (link.platform) {
                            case "instagram":
                              return (
                                <a href={link.url}>
                                  <div className="border rounded-full p-3 cursor-pointer flex items-center justify-center lg:justify-start w-full">
                                    <Instagram className="mr-3 hover:text-primary" />
                                    Instagram
                                  </div>
                                </a>
                              );
                            case "facebook":
                              return (
                                <a href={link.url}>
                                  <div className="border rounded-full p-3 cursor-pointer flex items-center justify-center lg:justify-start">
                                    <Facebook className="mr-3 hover:text-primary" />
                                    Facebook
                                  </div>
                                </a>
                              );
                            case "twitter":
                              return (
                                <a href={link.url}>
                                  <div className="border rounded-full p-3 cursor-pointer flex items-center justify-center lg:justify-start">
                                    <Twitter className="mr-3 hover:text-primary" />
                                    Twitter
                                  </div>
                                </a>
                              );
                            case "linkedin":
                              return (
                                <a href={link.url}>
                                  <div className="border rounded-full p-3 cursor-pointer flex items-center justify-center lg:justify-start">
                                    <Linkedin className="mr-3 hover:text-primary" />
                                    LinkedIn
                                  </div>
                                </a>
                              );
                            case "web":
                              return (
                                <a href={link.url}>
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
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-white rounded-full bg-primary p-3 w-full lg:w-2/8 cursor-pointer font-bold tracking-wider mt-10"
                >
                  Uredi profil
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
