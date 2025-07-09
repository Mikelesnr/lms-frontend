import axios from "axios";

const api = axios.create({
  baseURL: "https://lms-api-i62r.onrender.com/",
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

export default api;
