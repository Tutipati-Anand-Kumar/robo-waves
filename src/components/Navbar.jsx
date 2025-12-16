import { FaUser, FaPlus, FaBell, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import Notification from "./Notification";

export default function Navbar() {
  const navigate = useNavigate();
  const { profilePhoto } = useSelector((state) => state.auth);

  // NOTIFICATION STATE (only here)
  const [openNotification, setOpenNotification] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="flex items-center justify-between border-b bg-white/50 backdrop-blur-md px-6 py-3 shadow-sm sticky top-0 z-40">

        {/* LOGO */}
        <div>
          <svg width="220" height="48" viewBox="0 0 220 48" fill="none">
            <g transform="translate(56,32)">
              <text x="0" y="0" fontFamily="Inter" fontWeight="700" fontSize="24" fill="purple">Blog</text>
              <text x="52" y="0" fontFamily="Inter" fontWeight="500" fontSize="24" fill="#2563EB">Verse</text>
            </g>
          </svg>
        </div>

        
        <div className="flex items-center gap-8">

          {/* HOME */}
          <span onClick={()=>{navigate("/")}}
          className="flex items-center gap-1 font-semibold cursor-pointer">
            <FaHome /> Home
          </span>

          {/* ABOUT */}
          <span
            onClick={() => navigate("/about")}
            className="font-semibold cursor-pointer"
          >
            About
          </span>

          {/* CREATE */}
          <button
            onClick={() => navigate("/create-article")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-800 hover:from-purple-800 hover:to-blue-500 text-white h-[35px] w-[100px] px-3 py-1.5 rounded-lg cursor-pointer"
          >
            <FaPlus /> Create
          </button>

          {/* NOTIFICATION ICON */}
          <FaBell
            className="text-xl cursor-pointer text-purple-600 hover:text-purple-800"
            onClick={() => setOpenNotification(!openNotification)}
          />

          {/* PROFILE IMAGE */}
          <div
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full cursor-pointer overflow-hidden border border-gray-300"
          >
            {profilePhoto ? (
              <img
                src={`data:image/jpeg;base64,${profilePhoto}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <FaUser className="text-gray-600" />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* NOTIFICATION DROPDOWN — FIXED BELOW NAVBAR */}
      {openNotification && (
        <div className="fixed right-20 top-16 z-50">
          <Notification onClose={() => setOpenNotification(false)} />
        </div>
      )}
    </>
  );
}
