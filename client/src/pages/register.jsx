import { useState } from "react";
import doorIcon from "../assets/door.svg";
import logo from "../assets/hnta-logo.png";

export default function Register() {
  return (
    <div className="text-white flex h-screen">
      <div className="left-box w-1/2  h-full flex items-center justify-center">
        <img src={doorIcon} alt="vrata-vizual" className="w-5/6 h-5/6" />
      </div>
      <div className="right-box w-1/2  h-full">
        <div className="flex items-center justify-start mt-10">
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
      </div>
    </div>
  );
}
