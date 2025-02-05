import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import doorIcon from "../assets/door.svg";
import logo from "../assets/hnta-logo.png";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Molimo unesite ispravan mail")
    .required("Ovo polje je obavezno"),
  password: yup.string().required("Ovo polje je obavezno"),
});

export default function Register() {
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
    <div className="text-white flex h-screen">
      <div className="left-box w-1/2  h-full flex items-center justify-center">
        <img src={doorIcon} alt="vrata-vizual" className="w-5/6 h-5/6" />
      </div>
      <div className="right-box w-1/2  h-full">
        <div className="flex items-center justify-start mt-10 mb-10">
          <div>
            <img src={logo} alt="hnta-logo" className="h-40 w-40" />
          </div>
          <div className="color-white">
            <h1 className="text-7xl font-black mb-4 tracking-wide">
              Registruj se
            </h1>
            <p className="text-lg font-medium tracking-wide">
              Lorem ipsum dolor sit amet.
            </p>
          </div>
        </div>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 rounded-lg shadow-md w-96"
          >
            {/* Email Field */}
            <div className="mb-4">
              <input
                {...register("email")}
                type="email"
                className="w-full p-4 mb-5 border rounded mt-1 rounded-full placeholder-white"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500 tracking-wider text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <input
                {...register("password")}
                type="password"
                className="w-full p-4 border rounded mt-1 rounded-full placeholder-white mb-5"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 tracking-wider text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded-full font-semibold tracking-wider mt-10 cursor-pointer"
            >
              Nastavi
            </button>
            <p className="text-center mt-5 tracking-wider">
              Već imaš račun?{" "}
              <span className="text-primary cursor-pointer">Prijavi se.</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
