import { useState } from "react";
import doorIcon from "../assets/door.svg";
import logo from "../assets/hnta-logo.png";

export default function Register() {
  return (
    <div className="text-white flex h-screen">
      <div className="left-box w-1/2  h-full flex items-center justify-center">
        <img src={doorIcon} alt="vrata-vizual" className="w-5/6 h-5/6" />
      </div>
      <div className="right-box w-1/2 bg-orange-300 h-full">
        <div>
          <div>
            <img src={logo} alt="hnta-logo" className="h-40 w-40" />
          </div>
          <div>some text</div>
        </div>
      </div>
    </div>
  );
}
