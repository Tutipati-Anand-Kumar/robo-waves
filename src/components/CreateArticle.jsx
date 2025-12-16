import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createArticle } from "../redux/slices/articleSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

const CreateArticle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error } = useSelector((state) => state.articles);

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(createArticle(form));

    if (res?.meta?.requestStatus === "fulfilled") {
      toast.success("Article Created Successfully!");
      setTimeout(() => navigate("/"), 1000);
    } else {
      toast.error(res.payload || "Failed to create article");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">

      {/* Glassy card */}
      <div className="bg-white/30 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-white/40">

        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-sky-500 bg-clip-text text-transparent text-center mb-6 max-[650px]:text-xl">
          Create New Article
        </h2>

        {error && (
          <p className="bg-red-500/80 text-white p-2 rounded mb-4 text-center backdrop-blur-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="text-gray-800 block mb-2 font-medium">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter article title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/50 border border-white/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-inner"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-gray-800 block mb-2 font-medium">Content</label>
            <textarea
              name="content"
              rows="5"
              placeholder="Write your article..."
              value={form.content}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/50 border border-white/40 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-inner"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl max-[650px]:py-2 max-[650px]:text-md"
          >
            {status === "loading" ? "Publishing..." : "Publish Article"}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default CreateArticle;



