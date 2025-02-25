import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff } from "lucide-react";

import logo from "../assets/hnta-logo.png";
import pencilIcon from "../assets/pencil.svg";

const schema = yup.object().shape({
  email: yup.string().required("Ovo polje je obavezno"),
  password: yup.string().required("Ovo polje je obavezno"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="text-white flex flex-col lg:flex-row h-screen">
      <div className="left-box relative max-w-screen lg:w-1/2 max-h-full lg:block flex items-center justify-center">
        <img
          src={pencilIcon}
          alt="olovka-vizual"
          className="absolute lg:static max-w-screen h-3xs lg:w-max lg:max-h-screen"
        />
      </div>
      <div className="right-box w-screen lg:w-1/2 max-h-full">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start mt-10 mb-10">
          <div>
            <img
              src={logo}
              alt="hnta-logo"
              className="h-20 w-20 lg:h-40 lg:w-40"
            />
          </div>
          <div className="color-white text-wrap">
            <h1 className="text-2xl lg:text-7xl font-black mb-4 tracking-wider lg:whitespace-pre-line">
              Dobro došli nazad
            </h1>
            <p className="text-lg font-medium tracking-wide text-center lg:text-left">
              Lorem ipsum dolor sit amet.
            </p>
          </div>
        </div>

        <div className="flex lg:justify-start items-center justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-5 rounded-lg shadow-md w-96"
          >
            {/* Email Field */}
            <div className="mb-4">
              <input
                {...register("email")}
                type="email"
                className="lg:w-full w-xs p-4 mb-5 border rounded mt-1 rounded-full placeholder-white"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500 tracking-wider text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4 relative flex justify-center items-center">
              <input
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

              {errors.password && (
                <p className="text-red-500 tracking-wider text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-xs lg:w-full bg-primary text-white p-2 rounded-full font-semibold tracking-wider mt-10 cursor-pointer"
            >
              Nastavi
            </button>

            <p className="text-center mt-5 tracking-wider">
              Zaboravili ste šifru?
            </p>
            <p className="text-center mt-5 tracking-wider">
              Nemate korisnički račun?{" "}
              <span className="text-primary cursor-pointer">
                Kreirajte ga ovdje.
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
