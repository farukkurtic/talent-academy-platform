import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import doorIcon from "../assets/door.svg";
import logo from "../assets/hnta-logo.png";

const schema = yup.object().shape({
  firstName: yup.string().required("Ovo polje je obavezno"),
  lastName: yup.string().required("Ovo polje je obavezno"),
  major: yup.string().required("Ovo polje je obavezno"),
  profession: yup.string().required("Ovo polje je obavezno"),
  yearOfAttend: yup
    .number()
    .typeError("Godina mora biti broj")
    .positive("Godina mora biti pozitivan broj")
    .integer("Godina mora biti cijeli broj")
    .required("Ovo polje je obavezno"),
  purposeOfPlatform: yup
    .array()
    .min(1, "Morate odabrati barem jednu opciju")
    .required("Morate odabrati barem jednu opciju"),
  biography: yup
    .string()
    .required("Ovo polje je obavezno")
    .max(500, "Biografija ne smije biti duža od 500 karaktera"),
});

export default function ProfileDetails() {
  const [userId, setUserId] = useState(null);
  const [bioLength, setBioLength] = useState(0); // State to track biography length

  const navigate = useNavigate();
  const location = useLocation();
  const fromRegister = location.state?.from === "registracija";

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
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      purposeOfPlatform: ["Networking"], // Default selection
    },
  });

  const biography = watch("biography", ""); // Watch the biography field for changes

  // Update bioLength whenever biography changes
  useEffect(() => {
    setBioLength(biography.length);
  }, [biography]);

  const onSubmit = async (data) => {
    try {
      const newObj = {
        ...data,
        _id: userId,
      };

      const response = await axios.put(
        "http://localhost:5000/api/user",
        newObj
      );
      if (response.status === 200) {
        navigate("/profil-detalji-dodatno", {
          state: { from: "profil-detalji" },
        });
      } else {
        alert("Desila se greška. Molimo pokušajte ponovo");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="text-white flex flex-col lg:flex-row min-h-screen">
      {/* Left Box (Door Icon) - 50% on desktop, full width on mobile */}
      <div className="left-box w-full lg:w-1/2 flex items-center justify-center">
        <img
          src={doorIcon}
          alt="vrata-vizual"
          className="w-3xs h-3xs lg:w-5/6 lg:h-5/6"
        />
      </div>

      {/* Right Box (Form) - 50% on desktop, full width on mobile */}
      <div className="right-box w-full lg:w-1/2 flex flex-col lg:items-start justify-center lg:overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start mt-10 lg:mt-60 xl:mt-10 mb-10 px-4">
          <img
            src={logo}
            alt="hnta-logo"
            className="h-20 w-20 lg:h-40 lg:w-40"
          />
          <div className="color-white text-center lg:text-left">
            <h1 className="text-2xl lg:text-7xl font-black mb-4 tracking-wider">
              Registruj se
            </h1>
            <p className="text-lg font-medium tracking-wide">
              Lorem ipsum dolor sit amet.
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex lg:justify-start items-center justify-center w-full px-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 rounded-lg shadow-md w-full flex flex-col lg:flex-row gap-6"
            id="form-id"
          >
            {/* Left Side (Fields) */}
            <div className="w-full lg:w-1/2 flex flex-col">
              {/* First Name and Last Name */}
              <div className="flex flex-col lg:flex-row gap-5">
                <div className="w-full lg:w-1/2">
                  <input
                    {...register("firstName")}
                    className="w-full p-4 placeholder-white mb-5 mt-1 border rounded rounded-full placeholder-white"
                    placeholder="Ime"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mb-5">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="w-full lg:w-1/2">
                  <input
                    {...register("lastName")}
                    className="w-full p-4 placeholder-white mb-5 mt-1 border rounded rounded-full placeholder-white"
                    placeholder="Prezime"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mb-5">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Major */}
              <div className="w-full">
                <input
                  {...register("major")}
                  className="w-full p-4 placeholder-white mb-5 mt-1 border rounded rounded-full placeholder-white"
                  placeholder="Smjer"
                />
                {errors.major && (
                  <p className="text-red-500 text-sm mb-5">
                    {errors.major.message}
                  </p>
                )}
              </div>

              {/* Profession */}
              <div className="w-full">
                <input
                  {...register("profession")}
                  className="w-full p-4 placeholder-white mb-5 mt-1 border rounded rounded-full placeholder-white"
                  placeholder="Profesija"
                />
                {errors.profession && (
                  <p className="text-red-500 text-sm mb-5">
                    {errors.profession.message}
                  </p>
                )}
              </div>

              {/* Year of Attendance */}
              <div className="w-full">
                <input
                  {...register("yearOfAttend")}
                  type="number"
                  className="w-full p-4 placeholder-white mb-5 mt-1 border rounded rounded-full placeholder-white"
                  placeholder="Godina prisustva"
                />
                {errors.yearOfAttend && (
                  <p className="text-red-500 text-sm mb-5">
                    {errors.yearOfAttend.message}
                  </p>
                )}
              </div>

              {/* Purpose of Platform */}
              <div className="w-full">
                <label className="block mb-3">
                  Kako planirate koristiti platformu?
                </label>
                <div className="flex flex-wrap gap-3">
                  {["Networking", "Skill sharing", "Mentorship"].map(
                    (value) => (
                      <label
                        key={value}
                        className="border rounded-full p-2 flex items-center"
                      >
                        <input
                          type="checkbox"
                          {...register("purposeOfPlatform")}
                          value={value}
                          className="accent-primary mr-2"
                        />
                        {value}
                      </label>
                    )
                  )}
                </div>
                {errors.purposeOfPlatform && (
                  <p className="text-red-500 text-sm mt-4 mb-5">
                    {errors.purposeOfPlatform.message}
                  </p>
                )}
              </div>
            </div>

            {/* Right Side (Biography) */}
            <div className="w-full lg:w-1/2">
              <div className="mb-4 h-full">
                <textarea
                  {...register("biography")}
                  className="w-full p-4 border rounded rounded-3xl placeholder-white overflow-hidden resize-none"
                  placeholder="Biografija:"
                  rows="6"
                  maxLength={500}
                  onInput={(e) => {
                    e.target.style.height = "auto"; // Reset height
                    e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scroll height
                  }}
                ></textarea>
                <p className="text-sm text-gray-400 mt-2">
                  Preostalo karaktera: {500 - bioLength}
                </p>
                {errors.biography && (
                  <p className="text-red-500 text-sm">
                    {errors.biography.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-1/2 bg-primary text-white p-2 rounded-full font-semibold tracking-wider mt-4 mb-4 cursor-pointer mx-auto lg:mx-0"
          form="form-id"
        >
          Nastavi
        </button>
      </div>
    </div>
  );
}
