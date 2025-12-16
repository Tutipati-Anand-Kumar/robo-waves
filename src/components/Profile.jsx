import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import Navbar from "./Navbar";
import toast from "react-hot-toast";
import { acceptFollowRequest, sendFollowRequest , rejectFollowRequest } from "../redux/slices/friendSlice";



const Profile = () => {
  const { user } = useSelector((state) => state.auth);   // full backend user object
  console.log(user)
  const profilePhoto = useSelector((state) => state.auth.profilePhoto);

  const followersCount = user?.followers?.length || 0;
  const followingCount = user?.following?.length || 0;
  // const pendingRequests = user?.pendingRequests || [];
  const pendingRequests = useSelector(
  (state) => state.follow.requests
);

  const [usernameInput, setUsernameInput] = useState("");

  const navigate = useNavigate();

  const [showLogout, setShowLogout] = useState(false);

  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("authtoken");
    navigate("/login");
  };

/*  SEND REQUEST */
const handleSendRequest = () => {
  if (!usernameInput.trim()) {
    toast.error("Enter a username");
    return;
  }

  dispatch(sendFollowRequest({ targetUsername: usernameInput }))
    .unwrap()
    .then(() => {
      toast.success(`Request sent to @${usernameInput}`);
      setUsernameInput("");
    })
    .catch((err) => {
      toast.error(err || "Failed to send request");
    });
};

/*  ACCEPT REQUEST */
const handleAccept = (followerId) => {
  dispatch(acceptFollowRequest({ followerId }))
    .unwrap()
    .then(() => {
      toast.success("Follow request accepted");
    })
    .catch((err) => {
      toast.error(err || "Accept failed");
    });
};

/*  REJECT REQUEST */
const handleReject = (followerId) => {
  dispatch(rejectFollowRequest({ followerId }))
    .unwrap()
    .then(() => {
      toast.success("Follow request rejected");
    })
    .catch((err) => {
      toast.error(err || "Reject failed");
    });
};


  return (
    <div className="relative min-h-screen text-gray-800 font-sans 
      bg-[url('./image1.png')] bg-cover bg-center bg-fixed flex  flex-col">
      <Navbar/>
      <div className="w-full h-160 flex items-center justify-center ">
        <div className={`${showLogout ? "blur-sm pointer-events-none" : ""}`}>
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl p-10">

          {/* TOP SECTION */}
          <div className="flex items-center gap-8">

            {/* PROFILE IMAGE */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
              {profilePhoto ? (
                <img
                  src={`data:image/jpeg;base64,${profilePhoto}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-gray-600 text-4xl" />
              )}
            </div>

            {/* USER INFO */}
            <div>
              <h2 className="text-2xl font-bold">{user?.username}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>

            {/* FOLLOW STATS */}
            <div className="ml-auto flex gap-12 text-center">
              <div>
                <p className="text-xl font-bold">{followingCount}</p>
                <p className="text-gray-600 text-sm">Following</p>
              </div>
              <div>
                <p className="text-xl font-bold">{followersCount}</p>
                <p className="text-gray-600 text-sm">Followers</p>
              </div>
            </div>
          </div>
          {/* Add Friends  */}
          <div className="my-8">
            <h3 className="text-xl font-semibold mb-3">Add Friends + </h3>
            <div className="flex space-between gap-3">
              <input
              className="border p-2 rounded-xl w-64 h-9"
              placeholder="Enter username..."
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />

            <button
              onClick={()=>{handleSendRequest()}}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-800 hover:from-purple-800  hover:to-blue-500 text-white cursor-pointer"
            >
              Send Request
            </button>
            </div>
          </div>

          {/* PENDING REQUESTS SECTION */}
          <div className="m-2">
            <h3 className="text-xl font-semibold mb-1">Pending Requests</h3>

            {pendingRequests.length === 0 ? (
              <p className="text-gray-500">No pending requests</p>
            ) : (
              <div className="space-y-2">
                {pendingRequests.map((req) => (
                  <div
                    key={req._id}
                    className="p-2 bg-gray-100 rounded-lg shadow-sm flex justify-between flex-row" 
                  >
                    <div className="flex flex-row items-center justify-center gap-3 mr-1">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                      {profilePhoto ? (
                        <img
                          src={`data:image/jpeg;base64,${req.profilePhoto}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUser className="text-gray-600 text-4xl" />
                      )}
                    </div>
                    <div className="flex justify-center flex-col">
                      <span>{req.username || "Unknown user"}</span>
            
                      {/* <span>{req.email || "Unknown user"}</span> */}
                    </div>
                    </div>

                    {/* Accept / Reject buttons (OPTIONAL) */}
                    <div className="flex gap-2">
                      <button 
                      onClick={() => handleAccept(req._id)} 
                      className=" px-4 py-1 bg-green-500 text-white rounded-lg cursor-pointer">
                        Accept
                      </button>
                      <button 
                        onClick={() => handleReject(req._id)}
                        className="px-4 py-1 bg-red-500 text-white rounded-lg cursor-pointer">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-end mt-5">
            <button
                onClick={() => setShowLogout(true)}
                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white h-[35px] w-[100px] px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Logout
              </button>
          </div>
      </div>
      </div>
      {showLogout && (
        <Logout
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
      </div>
    </div>
    
  );
};

export default Profile;
