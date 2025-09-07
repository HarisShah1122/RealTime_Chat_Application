import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:8081/api";

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

// Auto attach token if exists
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});
