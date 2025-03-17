import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import doorIcon from "../assets/visuals/door.svg";
import logo from "../assets/logos/hnta-logo.png";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Molimo unesite ispravan mail")
    .required("Ovo polje je obavezno"),
  password: yup.string().required("Ovo polje je obavezno"),
});

export default function Register() {
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
      const response = await axios.post(
        "http://localhost:5000/api/auth/registracija",
        data
      );

      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        navigate("/profil-detalji", { state: { from: "registracija" } });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 404) {
          setResponseErr(<>Korisnički nalog nije pronađen.</>);
        } else if (status === 400) {
          setResponseErr(
            <>
              Korisnik je već registrovan.{" "}
              <span className="text-primary cursor-pointer">Prijavi se</span>
            </>
          );
        } else if (status === 401) {
          setResponseErr(
            <>Korisnički podaci nisu ispravni. Pokušajte ponovo.</>
          );
        } else {
          setResponseErr(<>Desila se greška. Molimo pokušajte opet.</>);
        }
      }
    }
  };

  return (
    <div className="text-white flex flex-col lg:flex-row h-screen">
      <div className="left-box max-w-screen lg:w-1/2 max-h-full flex items-center justify-center">
        <img
          src={doorIcon}
          alt="vrata-vizual"
          className="w-3xs h-3xs lg:w-5/6 lg:h-5/6"
        />
      </div>
      <div className="right-box w-screen lg:w-1/2 max-h-full flex flex-col lg:items-start justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start mt-10 mb-10">
          <div>
            <img
              src={logo}
              alt="hnta-logo"
              className="h-20 w-20 lg:h-40 lg:w-40"
            />
          </div>
          <div className="color-white text-center">
            <h1 className="text-2xl lg:text-7xl font-black mb-4 tracking-wider">
              Registruj se
            </h1>
            <p className="text-lg font-medium tracking-wide text-center lg:text-left">
              Lorem ipsum dolor sit amet.
            </p>
          </div>
        </div>
        <div className="flex lg:justify-start items-center justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 rounded-lg shadow-md w-96 "
          >
            <div className="mb-4">
              <input
                {...register("email")}
                type="email"
                className="lg:w-full w-xs p-4 mb-5 border rounded mt-1 rounded-full placeholder-white"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500 tracking-wider text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-4 relative flex justify-center items-center">
              <input
                autoComplete="off"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="w-full p-4 border rounded mt-1 rounded-full placeholder-white mb-5 pr-12 flex items-center justify-center mr-5"
                placeholder="Password"
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
            <a href="/prijava">
              <p className="text-center mt-5 tracking-wider">
                {responseErr ? (
                  responseErr
                ) : (
                  <>
                    Već imaš račun?{" "}
                    <span className="text-primary cursor-pointer">
                      Prijavi se.
                    </span>
                  </>
                )}
              </p>
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
