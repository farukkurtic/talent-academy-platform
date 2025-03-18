import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import axios from "axios";

import Sidebar from "../components/sidebar";

import { X } from "lucide-react";

import line2 from "../assets/lines/s2.svg";
import line5 from "../assets/lines/s5.svg";

const schema = yup.object().shape({
  name: yup.string().required("Ovo polje je obavezno"),
  dateTime: yup
    .date()
    .typeError("Ovo polje je obavezno")
    .required("Ovo polje je obavezno"),
  category: yup.string().required("Ovo polje je obavezno"),
  description: yup.string().required("Ovo polje je obavezno"),
  link: yup
    .string()
    .url("Link mora biti validan URL")
    .required("Ovo polje je obavezno"),
  coverPhoto: yup.mixed(),
});

export default function KreirajRadionicu() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const textareaRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/registracija");
    } else {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [dateTime, setDateTime] = useState(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      const adjustTextareaHeight = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      };

      textarea.addEventListener("input", adjustTextareaHeight);
      adjustTextareaHeight();

      return () => {
        textarea.removeEventListener("input", adjustTextareaHeight);
      };
    }
  }, []);

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

  const onSubmit = async (data) => {
    try {
      const workshopData = {
        createdBy: userId,
        name: data.name,
        dateOfStart: new Date(data.dateTime).toISOString(),
        type: data.category,
        details: data.description,
        link: data.link,
      };

      const formData = new FormData();
      Object.entries(workshopData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (imageFile) {
        formData.append("coverImage", imageFile);
      }

      const response = await axios.post(
        "http://localhost:5000/api/workshop",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        navigate("/radionice");
      }
    } catch (err) {
      console.error("Greška pri kreiranju radionice:", err);
      alert("Došlo je do greške pri kreiranju radionice.");
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

  return (
    <div className="flex min-h-screen bg-black text-white relative overflow-x-hidden">
      <img src={line5} className="fixed hidden lg:block -right-65 -top-15" />
      <img
        src={line2}
        className="fixed hidden lg:block -right-0 bottom-0 rotate-180"
      />
      <Sidebar
        userId={userId}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        searchResults={searchResults}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <div className="w-full lg:w-1/2 p-6 lg:ml-85">
        <h1 className="text-3xl font-bold mb-6 tracking-wider">
          Kreiraj radionicu
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium mb-2">
                Naziv radionice
              </label>
              <input
                autoComplete="off"
                type="text"
                {...register("name")}
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">
                Kategorija
              </label>
              <select
                {...register("category")}
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                <option
                  value=""
                  disabled
                  selected
                  className="bg-gray-800 text-white"
                >
                  Odaberite kategoriju
                </option>
                <option value="Kreativno pisanje">Kreativno pisanje</option>
                <option value="Odgovorno kodiranje">Odgovorno kodiranje</option>
                <option value="Novinarstvo">Novinarstvo</option>
                <option value="Muzička produkcija">Muzička produkcija</option>
                <option value="Grafički dizajn">Grafički dizajn</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">
              Datum i vrijeme
            </label>
            <Flatpickr
              options={{
                enableTime: true,
                dateFormat: "d/m/Y H:i",
                time_24hr: true,
                minDate: "today",
                disableMobile: "true",
              }}
              value={dateTime}
              onChange={([date]) => {
                setDateTime(date);
                setValue("dateTime", date);
              }}
              className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ width: "100%", padding: "0.75rem" }}
            />
            {errors.dateTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dateTime.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">Opis</label>
            <textarea
              {...register("description")}
              ref={textareaRef}
              className="w-full p-3 rounded-xl bg-gray-800 text-white"
              style={{ minHeight: "200px", resize: "none" }}
              value={watch("description") || ""}
              maxLength={1500}
              onChange={(e) => {
                setCharCount(e.target.value.length);
                setValue("description", e.target.value, {
                  shouldValidate: true,
                });

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
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-lg font-medium mb-2  ">
              Link za radionicu
            </label>
            <input
              autoComplete="off"
              type="url"
              {...register("link")}
              className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary mb-2"
            />
            {errors.link && (
              <p className="text-red-500 text-sm mt-1">{errors.link.message}</p>
            )}
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">
              Naslovna slika
            </label>
            <div className="relative w-full lg:w-100 h-70 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Naslovna slika"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-800"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <label className="cursor-pointer">
                  <span className="text-gray-500">Dodaj sliku</span>
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
            className="w-full bg-primary text-white p-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
          >
            Kreiraj radionicu
          </button>
        </form>
      </div>
    </div>
  );
}
