import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Flatpickr from "react-flatpickr";
import defaultPic from "../assets/defaults/defaultPic.svg";
import defaultWorkshopPic from "../assets/logos/textLogo.svg";
import "flatpickr/dist/themes/dark.css";
import Modal from "react-modal";
import {
  Menu,
  MessageSquare,
  GraduationCap,
  UserPen,
  X,
  MoreVertical,
} from "lucide-react";
import hntaLogo from "../assets/logos/hnta-logo.png";
import textLogo from "../assets/logos/textLogo.svg";

import kodiranje from "../assets/badges/kodiranje.svg";
import pisanje from "../assets/badges/kreativnoPisanje.svg";
import graficki from "../assets/badges/grafickiDizajn.svg";
import novinarstvo from "../assets/badges/novinarstvo.svg";
import muzika from "../assets/badges/muzickaProdukcija.svg";

Modal.setAppElement("#root");

export default function WorkshopDetails() {
  const { workshopId } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const [errors, setErrors] = useState({});
  const textareaRef = useRef(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [charCount, setCharCount] = useState(0); // Track character count

  useEffect(() => {
    if (!isEditing) {
      setCharCount(workshop?.details?.length || 0);
    }
  }, [isEditing, workshop?.details]);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/workshop/${workshopId}`
        );
        setWorkshop(response.data.workshop);
        setCharCount(response.data.workshop.details.length);
        fetchAttendees(response.data.workshop.attendes);
        fetchOrganizer(response.data.workshop.createdBy);
      } catch (err) {
        console.error("Error fetching workshop:", err);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }

    fetchWorkshop();
  }, [workshopId]);

  const fetchOrganizer = async (organizerId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/id/${organizerId}`
      );
      setOrganizer(response.data.user);
    } catch (err) {
      console.error("Error fetching organizer:", err);
    }
  };

  const fetchAttendees = async (attendeeIds) => {
    try {
      const attendeesData = await Promise.all(
        attendeeIds.map(async (id) => {
          const response = await axios.get(
            `http://localhost:5000/api/user/id/${id}`
          );
          return response.data.user;
        })
      );
      setAttendees(attendeesData);
    } catch (err) {
      console.error("Error fetching attendees:", err);
    }
  };

  const handleAttend = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/workshop/${workshopId}/attend`,
        { userId }
      );
      const response = await axios.get(
        `http://localhost:5000/api/workshop/${workshopId}`
      );
      setWorkshop(response.data.workshop);
      fetchAttendees(response.data.workshop.attendes);
    } catch (err) {
      console.error("Error attending workshop:", err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setDateTime(new Date(workshop?.dateOfStart));
    setSelectedImage(
      workshop?.coverImage
        ? `http://localhost:5000/api/posts/image/${workshop?.coverImage}`
        : null
    );
  };

  const handleSave = async (updatedWorkshop) => {
    const newErrors = {};
    if (!updatedWorkshop.name) newErrors.name = "Naziv radionice je obavezan";
    if (!updatedWorkshop.dateOfStart)
      newErrors.dateOfStart = "Datum i vrijeme su obavezni";
    if (!updatedWorkshop.type) newErrors.type = "Kategorija je obavezna";
    if (!updatedWorkshop.details) newErrors.details = "Opis je obavezan";
    if (!updatedWorkshop.link) newErrors.link = "Link je obavezan";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("workshopId", workshop._id);
      formData.append("name", updatedWorkshop.name);
      formData.append(
        "dateOfStart",
        new Date(updatedWorkshop.dateOfStart).toISOString()
      );
      formData.append("type", updatedWorkshop.type);
      formData.append("details", updatedWorkshop.details);
      formData.append("link", updatedWorkshop.link);

      if (imageFile) {
        formData.append("coverImage", imageFile);
      } else if (!selectedImage) {
        formData.append("removeCoverImage", "true");
      }

      const response = await axios.put(
        "http://localhost:5000/api/workshop",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsEditing(false);
      setWorkshop(response.data.workshop);
      setSelectedImage(null);
      setImageFile(null);
      setErrors({});
    } catch (err) {
      console.error("Error updating workshop:", err);
      alert("Došlo je do greške pri ažuriranju radionice.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
    } else {
      alert("Molimo odaberite sliku.");
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageFile(null);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/prijava");
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/workshop/${workshopId}`
      );
      if (response.status === 200) {
        navigate("/radionice");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const adjustHeight = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      };

      textarea.addEventListener("input", adjustHeight);
      adjustHeight();

      return () => {
        textarea.removeEventListener("input", adjustHeight);
      };
    }
  }, [isEditing, workshop?.details]);

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

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-85 p-6 overflow-y-auto">
        <div className="w-full lg:w-1/2">
          {/* Workshop Header */}
          <div className="flex lg:flex-row justify-between items-start lg:items-center mb-6 mt-30 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-wider order-1 lg:order-1">
              {workshop?.name}
            </h1>
            {workshop?.createdBy === userId && (
              <div className="header-menu-container order-2 lg:order-2 mb-5 lg:mb-0 relative">
                <button
                  onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
                  className="p-2 rounded-full hover:bg-gray-700 focus:outline-none"
                >
                  <MoreVertical size={24} />
                </button>
                {isHeaderMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        setIsHeaderMenuOpen(false);
                        handleEdit();
                      }}
                      className="w-full flex items-center gap-2 p-3 hover:bg-gray-700 rounded-t-lg"
                    >
                      <span>Uredi radionicu</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsHeaderMenuOpen(false);
                        handleDelete();
                      }}
                      className="w-full flex items-center gap-2 p-3 hover:bg-gray-700 rounded-b-lg"
                    >
                      <span>Izbriši radionicu</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            {!workshop?.coverImage ? (
              <img
                crossOrigin="anonymous"
                src={defaultWorkshopPic}
                alt={workshop?.name}
                className="w-full h-auto object-cover mb-6 rounded-lg"
              />
            ) : (
              <img
                crossOrigin="anonymous"
                src={`http://localhost:5000/api/posts/image/${workshop?.coverImage}`}
                alt={workshop?.name}
                className="w-full h-auto object-cover mb-6 rounded-lg"
              />
            )}
            <p className="text-white mb-6">{workshop?.details}</p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Informacije</h2>
              <div className="space-y-2">
                <p>
                  <strong>Datum i vrijeme:</strong>{" "}
                  {new Date(workshop?.dateOfStart).toLocaleString()}
                </p>
                <p>
                  <strong>Kategorija:</strong> {workshop?.type}
                </p>
                <p>
                  <strong>Link:</strong>{" "}
                  <a
                    href={workshop?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {workshop?.link}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {workshop?.createdBy !== userId && (
              <button
                onClick={handleAttend}
                className="bg-primary p-3 rounded-full w-full lg:w-1/2 mb-6"
              >
                {workshop?.attendes.includes(userId)
                  ? "Otkaži prijavu"
                  : "Prijavi se"}
              </button>
            )}

            {/* Organizator Section */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6 w-full lg:w-1/2">
              <h2 className="text-xl font-semibold mb-4 tracking-wider">
                Organizator
              </h2>
              <a
                href={
                  userId === organizer?._id
                    ? "/moj-profil"
                    : `/profil/${organizer?._id}`
                }
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    crossOrigin="anonymous"
                    src={
                      organizer?.image
                        ? `http://localhost:5000/api/posts/image/${organizer.image}`
                        : defaultPic
                    }
                    alt={`${organizer?.firstName} ${organizer?.lastName}`}
                    className="w-10 h-10 rounded-full"
                  />
                  <p>
                    {organizer?.firstName} {organizer?.lastName}
                  </p>
                </div>
              </a>
            </div>

            {/* Učesnici Section */}
            <div className="bg-gray-800 p-4 rounded-lg w-full lg:w-1/2">
              <h2 className="text-xl font-semibold mb-4 tracking-wider">
                Učesnici
              </h2>
              {attendees.length > 0 ? (
                attendees.map((attendee) => (
                  <a
                    key={attendee._id}
                    href={
                      userId === attendee._id
                        ? "/moj-profil"
                        : `/profil/${attendee._id}`
                    }
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        crossOrigin="anonymous"
                        src={
                          attendee.image
                            ? `http://localhost:5000/api/posts/image/${attendee.image}`
                            : defaultPic
                        }
                        alt={`${attendee.firstName} ${attendee.lastName}`}
                        className="w-10 h-10 rounded-full"
                      />
                      <p>
                        {attendee.firstName} {attendee.lastName}
                      </p>
                    </div>
                  </a>
                ))
              ) : (
                <p className="text-gray-400">Nema učesnika</p>
              )}
            </div>
          </div>
        </div>
        <Modal
          isOpen={isEditing}
          onRequestClose={() => setIsEditing(false)}
          shouldCloseOnOverlayClick={false}
          contentLabel="Edit Workshop Modal"
          className="bg-gray-800 rounded-lg w-full max-w-xl p-4 mx-auto my-8 relative min-h-[70vh] overflow-y-auto scrollbar-hide text-white"
          overlayClassName="absolute right-0 top-10 bg-black bg-opacity-90 flex items-center justify-center p-4"
        >
          <button
            onClick={() => setIsEditing(false)}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-700 hover:bg-gray-600"
          >
            <X size={18} />
          </button>
          <h2 className="text-xl font-bold mb-4">Uredi radionicu</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const updatedWorkshop = {
                name: formData.get("name"),
                dateOfStart: dateTime,
                type: formData.get("type"),
                details: formData.get("details"),
                link: formData.get("link"),
              };
              handleSave(updatedWorkshop);
            }}
          >
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                defaultValue={workshop?.name}
                placeholder="Naziv radionice"
                className="w-full p-2.5 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
              <Flatpickr
                options={{
                  enableTime: true,
                  dateFormat: "d/m/Y H:i",
                  time_24hr: true,
                  minDate: "today",
                  disableMobile: "true",
                }}
                value={dateTime}
                onChange={([date]) => setDateTime(date)}
                className="w-full p-2.5 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
              />
              {errors.dateOfStart && (
                <p className="text-red-500 text-sm">{errors.dateOfStart}</p>
              )}
              <select
                name="type"
                defaultValue={workshop?.type}
                className="w-full p-2.5 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
                required
              >
                <option value="Kreativno pisanje">Kreativno pisanje</option>
                <option value="Odgovorno kodiranje">Odgovorno kodiranje</option>
                <option value="Novinarstvo">Novinarstvo</option>
                <option value="Muzička produkcija">Muzička produkcija</option>
                <option value="Grafički dizajn">Grafički dizajn</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type}</p>
              )}
              <textarea
                ref={textareaRef}
                name="details"
                defaultValue={workshop?.details}
                placeholder="Opis radionice"
                className="w-full p-2.5 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary resize-none overflow-hidden h-150"
                style={{ minHeight: "100px" }}
                maxLength={1500}
                onChange={(e) => {
                  setCharCount(e.target.value.length);
                  const textarea = textareaRef.current;
                  if (textarea) {
                    textarea.style.height = "auto";
                    textarea.style.height = `${textarea.scrollHeight}px`;
                  }
                }}
              />
              {/* Character counter */}
              <div className="text-sm text-gray-400 text-left">
                Preostalo karaktera: {charCount} / {1500}
              </div>
              {errors.details && (
                <p className="text-red-500 text-sm">{errors.details}</p>
              )}
              <input
                type="url"
                name="link"
                defaultValue={workshop?.link}
                placeholder="Link za radionicu"
                className="w-full p-2.5 rounded bg-gray-700 text-white focus:ring-2 focus:ring-primary"
              />
              {errors.link && (
                <p className="text-red-500 text-sm">{errors.link}</p>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Naslovna slika
                </label>
                <div className="relative w-full h-70 border-2 border-dashed border-gray-700 rounded flex items-center justify-center">
                  {selectedImage ? (
                    <>
                      <img
                        crossOrigin="anonymous"
                        src={selectedImage}
                        alt="Naslovna slika"
                        className="h-full w-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-600"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer text-gray-500">
                      Dodaj sliku
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary p-3 rounded-full w-full font-semibold hover:bg-primary-dark transition"
              >
                Spremi promjene
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
