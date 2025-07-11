import axios from "axios";

const api = axios.create({
  baseURL: "https://lms-api-i62r.onrender.com",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json", // ✅ Ensures consistent payload format
  },
  timeout: 10000, // Optional: avoid hanging requests
});

export default api;
