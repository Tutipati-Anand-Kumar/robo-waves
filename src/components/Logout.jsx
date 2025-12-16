import React from "react";
import { motion } from "framer-motion";

const Logout = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-start justify-center pt-20 bg-black/30 backdrop-blur-sm z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-6 w-[90%] max-w-[320px] text-center max-[650px]:p-4"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 max-[650px]:text-xl">
          Are you sure you want to Logout?
        </h2>
        <div className="flex justify-center gap-4 mt-6">
          {/* YES Button */}
          <button
            onClick={onConfirm}
            className="px-6 py-2 font-medium text-white rounded-full shadow-lg 
            bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 
            transition-all duration-300 transform hover:scale-105"
          >
            Yes
          </button>

          {/* NO Button */}
          <button
            onClick={onCancel}
            className="px-6 py-2 font-medium text-gray-700 rounded-full shadow-lg 
            bg-white/60 border border-white/50 hover:bg-white/80 
            transition-all duration-300 transform hover:scale-105"
          >
            No
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Logout;
