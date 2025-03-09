import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import doorIcon from "../assets/door.svg";
import logo from "../assets/hnta-logo.png";
import defaultPic from "../assets/defaultPic.svg";
import { X, Instagram, Facebook, Twitter, Linkedin, Globe } from "lucide-react";

const schema = yup.object().shape({
  instagram: yup.string().url("URL format nije ispravan").nullable(),
  facebook: yup.string().url("URL format nije ispravan").nullable(),
  twitter: yup.string().url("URL format nije ispravan").nullable(),
  linkedin: yup.string().url("URL format nije ispravan").nullable(),
  web: yup.string().url("URL format nije ispravan").nullable(),
});

export default function DetaljiFinalno() {
  const [userId, setUserId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const fromRegister = location.state?.from === "profil-detalji";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/registracija");
    } else {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  useEffect(() => {
    if (!fromRegister) {
      if (userId) {
        navigate("/feed");
      } else {
        navigate("/prijava");
      }
    }
  }, [fromRegister, navigate, userId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file.");
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    fileInputRef.current.value = "";
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Create an array of link objects, each with a single platform and URL
      const linksArray = Object.entries(data).map(([key, value]) => ({
        platform: key,
        url: value,
      }));

      // Append the links array to the form data
      formData.append("links", JSON.stringify(linksArray));

      // Append the image file if it exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Send the form data to the backend
      const response = await axios.put(
        `http://localhost:5000/api/user/${userId}/details`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        navigate("/feed");
      } else {
        alert("Desila se greška. Molimo pokušajte opet.");
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  return (
    <div className="text-white flex flex-col lg:flex-row min-h-screen">
      <div className="left-box w-full lg:w-1/2 flex items-center justify-center">
        <img
          src={doorIcon}
          alt="vrata-vizual"
          className="w-3xs h-3xs lg:w-5/6 lg:h-5/6"
        />
      </div>

      <div className="right-box w-full lg:w-1/2 flex flex-col lg:items-start justify-center lg:overflow-y-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start mt-10 lg:mt-60 xl:mt-10 mb-10 px-4">
          <img
            src={logo}
            alt="hnta-logo"
            className="h-20 w-20 lg:h-40 lg:w-40"
          />
          <div className="text-center lg:text-left">
            <h1 className="text-2xl lg:text-7xl font-black mb-4 tracking-wider">
              Registruj se
            </h1>
            <p className="text-lg font-medium tracking-wide">
              Lorem ipsum dolor sit amet.
            </p>
          </div>
        </div>

        <div className="w-full flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col items-center"
          >
            <div className="relative mb-15">
              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-45 h-45 rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 -right-5 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-800"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <img src={defaultPic} alt="Default" className="w-35" />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <p className="mt-10 tracking-wider">
                    Odaberite profilnu sliku
                  </p>
                </label>
              )}
            </div>
            <div className="mt-6 w-4/5 lg:w-3/5 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                {
                  name: "instagram",
                  Icon: Instagram,
                  placeholder: "Instagram",
                },
                { name: "facebook", Icon: Facebook, placeholder: "Facebook" },
                { name: "twitter", Icon: Twitter, placeholder: "X" },
                { name: "web", Icon: Globe, placeholder: "Web" },
                { name: "linkedin", Icon: Linkedin, placeholder: "LinkedIn" },
              ].map(({ name, Icon, placeholder }) => (
                <div key={name} className="relative w-full">
                  <div className="relative">
                    <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={placeholder}
                      {...register(name)}
                      className="w-full p-3 pl-12 rounded-full border border-gray-300 focus:outline-none"
                    />
                  </div>
                  {errors[name] && (
                    <p className="absolute text-red-500 text-sm mt-1">
                      {errors[name].message}
                    </p>
                  )}
                </div>
              ))}

              {/* Button takes full width but aligns properly with inputs */}
              <button
                type="submit"
                className="w-full bg-primary text-white p-3 rounded-full font-semibold tracking-wider cursor-pointer"
              >
                Završi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
