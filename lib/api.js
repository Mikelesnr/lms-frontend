import axios from "axios";

console.log("[axios] Base URL:", "http://localhost:8000");

const api = axios.create({
  baseURL: "http://localhost:8000", // no trailing '/api'
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

export default api;
