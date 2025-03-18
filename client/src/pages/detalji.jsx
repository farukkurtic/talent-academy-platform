import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import doorIcon from "../assets/visuals/door.svg";
import logo from "../assets/logos/hnta-logo.png";

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
  const [bioLength, setBioLength] = useState(0);
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
      purposeOfPlatform: ["Networking"],
    },
  });

  const biography = watch("biography", "");

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
        alert("Desila se greška. Molimo pokušajte opet.");
      }
    } catch (err) {
      console.log(err);
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
          <div className="color-white text-center lg:text-left">
            <h1 className="text-2xl lg:text-7xl font-black mb-4 tracking-wider">
              Registruj se
            </h1>
            <p className="text-lg font-medium tracking-wide">
              Lorem ipsum dolor sit amet.
            </p>
          </div>
        </div>
        <div className="flex lg:justify-start items-center justify-center w-full px-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 rounded-lg shadow-md w-full flex flex-col lg:flex-row gap-6"
            id="form-id"
          >
            <div className="w-full lg:w-1/2 flex flex-col">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="w-full lg:w-1/2">
                  <input
                    {...register("firstName")}
                    className="w-full p-4 placeholder-white mb-5 mt-1 border rounded rounded-full placeholder-white"
                    placeholder="Ime"
                    autoComplete="off"
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
                    autoComplete="off"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mb-5">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full relative flex flex-col justify-center">
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
                  <option value="Kreativno pisanje" className="bg-gray-800">
                    Kreativno pisanje
                  </option>
                  <option value="Grafički dizajn" className="bg-gray-800">
                    Grafički dizajn
                  </option>
                  <option value="Novinarstvo" className="bg-gray-800">
                    Novinarstvo
                  </option>
                  <option value="Muzička produkcija" className="bg-gray-800">
                    Muzička produkcija
                  </option>
                  <option value="Odgovorno kodiranje" className="bg-gray-800">
                    Odgovorno kodiranje
                  </option>
                </select>
                {errors.major && (
                  <p className="text-red-500 text-sm mb-5">
                    {errors.major.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <input
                  {...register("profession")}
                  className="w-full p-4 placeholder-white mb-5 mt-1 border rounded rounded-full placeholder-white"
                  placeholder="Profesija"
                  autoComplete="off"
                />
                {errors.profession && (
                  <p className="text-red-500 text-sm mb-5">
                    {errors.profession.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <select
                  {...register("yearOfAttend")}
                  className="w-full p-4 placeholder-white mb-5 mt-1 border rounded rounded-full bg-transparent text-white appearance-none"
                >
                  <option value="" disabled selected className="bg-gray-800">
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
              </div>
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
            <div className="w-full lg:w-1/2">
              <div className="mb-4 h-full">
                <textarea
                  {...register("biography")}
                  className="w-full p-4 border rounded rounded-3xl placeholder-white overflow-hidden resize-none"
                  placeholder="Biografija:"
                  rows="6"
                  maxLength={500}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
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
        <button
          type="submit"
          className="w-4/5 lg:w-1/2 bg-primary text-white p-3 rounded-full font-semibold tracking-wider mt-4 mb-4 cursor-pointer mx-auto lg:mx-0"
          form="form-id"
        >
          Nastavi
        </button>
      </div>
    </div>
  );
}
