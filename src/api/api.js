import axios from "axios";

const api = axios.create({
  baseURL: "https://robo-zv8u.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authtoken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;