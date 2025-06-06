import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logos/hnta-logo.png";
import pencilIcon from "../assets/visuals/pencil-alt.svg";

const schema = yup.object().shape({
  email: yup.string().required("Ovo polje je obavezno"),
  password: yup.string().required("Ovo polje je obavezno"),
});

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const [responseErr, setResponseErr] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/prijava`, data);

      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        navigate("/feed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 400) {
          setResponseErr(<>Neispravni podaci za prijavu. Pokušajte opet.</>);
        } else if (status === 404) {
          setResponseErr(
            <div>
              Korisnik nije pronađen.{" "}
              <span className="text-primary cursor-pointer">
                <a href="/registracija">Registrujte se</a>
              </span>
            </div>
          );
        } else {
          setResponseErr(<>Desila se greška. Molimo pokušajte opet.</>);
        }
      }
    }
  };

  return (
    <div className="text-white flex flex-col lg:flex-row h-screen lg:-translate-y-100 lg:translate-y-0">
      <div className="left-box flex justify-center items-start lg:w-1/2 ">
        <img
          src={pencilIcon}
          alt="olovka-vizual"
          className="h-3xs lg:h-full w-1/2 lg:w-full max-h-screen object-contain"
        />
      </div>
      <div className="right-box w-screen lg:w-1/2 max-h-full flex flex-col items-center lg:items-start justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start mt-10 mb-10">
          <div>
            <img
              src={logo}
              alt="hnta-logo"
              className="h-20 w-20 lg:h-40 lg:w-40"
            />
          </div>
          <div className="color-white text-wrap text-center">
            <h1 className="text-2xl lg:text-7xl font-black mb-4 mt-4 lg:mt-0 tracking-wider lg:whitespace-pre-line">
              Prijavite se!
            </h1>
            <p className="text-lg font-medium tracking-wide text-center lg:text-left">
              Lorem ipsum dolor sit amet.
            </p>
          </div>
        </div>
        <div className="flex lg:justify-start items-center justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-5 rounded-lg shadow-md w-full lg:w-96"
          >
            <div className="mb-4">
              <input
                {...register("email")}
                type="email"
                className="lg:w-full w-xs p-4 mb-5 border rounded mt-1 rounded-full placeholder-white"
                placeholder="Email"
                autoComplete="off"
              />
              {errors.email && (
                <p className="text-red-500 tracking-wider text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-4 relative flex justify-center items-center">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="w-full p-4 border rounded mt-1 rounded-full placeholder-white mb-1 pr-12 flex items-center justify-center mr-5"
                placeholder="Šifra"
                autoComplete="off"
              />
              {showPassword ? (
                <EyeOff size={30} onClick={togglePassword} />
              ) : (
                <Eye size={30} onClick={togglePassword} />
              )}
            </div>
            {errors.password && (
              <p className="text-red-500 tracking-wider text-sm">
                {errors.password.message}
              </p>
            )}
            <button
              type="submit"
              className="w-xs lg:w-full bg-primary text-white p-2 rounded-full font-semibold tracking-wider mt-10 cursor-pointer"
            >
              Nastavi
            </button>
            {responseErr ? (
              <p className="text-center mt-5 tracking-wider">{responseErr}</p>
            ) : (
              <p className="text-center mt-5 tracking-wider">
                Nemate korisnički račun?{" "}
                <span className="text-primary cursor-pointer">
                  <a href="/registracija">Kreirajte ga ovdje</a>
                </span>
              </p>
            )}
            <a href="/kontakt">
              <p className="text-center mt-5 tracking-wider cursor-pointer text-gray-400">
                Zaboravili ste šifru?
              </p>
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
