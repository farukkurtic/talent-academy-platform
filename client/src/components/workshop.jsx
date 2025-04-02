/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

import defaultPic from "../assets/logos/textLogo.svg";

const API_URL = import.meta.env.VITE_API_URL;

export default function Workshop({
  imageId,
  title,
  description,
  date,
  createdBy,
  onClick,
}) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/id/${createdBy}`);
        const { firstName, lastName } = response.data.user;
        setUserName(`${firstName} ${lastName}`);
      } catch (err) {
        console.error("Error fetching user name:", err);
      }
    };

    fetchUserName();
  }, [createdBy]);

  const truncatedDescription =
    description.length > 400 ? `${description.slice(0, 400)}...` : description;

  return (
    <div
      className="bg-black border border-gray-700 rounded-lg overflow-hidden max-w-md cursor-pointer"
      onClick={onClick}
    >
      {!imageId ? (
        <img
          crossOrigin="anonymous"
          src={defaultPic}
          alt={title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <img
          crossOrigin="anonymous"
          src={`${API_URL}/api/posts/image/${imageId}`}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{truncatedDescription}</p>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-3">
            {userName}
            <span className="text-gray-400 text-sm">{date}</span>
          </div>
          <button className="bg-primary px-4 py-2 rounded-full text-sm">
            Više
          </button>
        </div>
      </div>
    </div>
  );
}
