import React from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { acceptFollowRequest, rejectFollowRequest } from "../redux/slices/friendSlice";

function Notification({ onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const requests = user?.followRequests || [];

  const handleConfirm = (id) => {
    dispatch(acceptFollowRequest(id));
  };

  const handleDelete = (id) => {
    dispatch(rejectFollowRequest(id));
  };

  return (
    <div className="w-full sm:w-[350px] max-h-[60vh] sm:max-h-[500px] bg-white/75 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-3 relative overflow-y-auto z-50 max-[650px]:p-2 transition-all duration-300">
      <div className="flex justify-between items-center border-b border-gray-200/50 pb-2 mb-2">
        <h3 className="font-bold text-lg text-gray-800 max-[650px]:text-base">Notifications</h3>
        <IoMdClose
          className="cursor-pointer text-gray-500 hover:text-red-500 text-xl transition"
          onClick={onClose}
        />
      </div>

      <div className="flex flex-col gap-2">
        {requests.length === 0 ? (
          <div className="text-center py-3">
            <p className="text-gray-600 text-sm max-[400px]:text-xs">No new notifications</p>
          </div>
        ) : (
          requests.map((reqId) => (
            <div key={reqId} className="flex items-center justify-between gap-2 p-2 bg-white/40 rounded-xl border border-white/50 shadow-sm transition hover:bg-white/60 group relative max-[400px]:p-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 text-sm">
                  U
                </div>
                <div>
                  <p className="text-sm text-gray-800 max-[400px]:text-xs leading-tight">
                    <span className="font-semibold text-gray-900">User {String(reqId).substring(0, 6)}...</span>
                    <br />
                    <span className="text-[10px] text-gray-600">wants to follow you.</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleConfirm(reqId)}
                  className="bg-indigo-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-indigo-700 transition shadow-sm"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleDelete(reqId)}
                  className="text-gray-400 hover:text-red-500 transition p-1 rounded-full hover:bg-red-50"
                  title="Delete Notification"
                >
                  <IoMdClose size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notification;