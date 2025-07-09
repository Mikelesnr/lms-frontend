import axios from "axios";

const api = axios.create({
  baseURL: "localhost:8000",
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

export default api;
