import axios from "axios";
import Cookies from "@/node_modules/@types/js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Axios Request Interceptor
api.interceptors.request.use(
  async (config) => {
    // For non-GET requests (POST, PUT, PATCH, DELETE), ensure the XSRF-TOKEN is present and fresh
    if (config.method !== "get") {
      let xsrfToken = Cookies.get("XSRF-TOKEN");

      if (!xsrfToken) {
        try {
          // Attempt to get a new CSRF cookie
          await api.get("/sanctum/csrf-cookie");
          xsrfToken = Cookies.get("XSRF-TOKEN"); // Read the newly set token
        } catch (error) {
          console.error("Failed to fetch CSRF cookie:", error);
        }
      }

      if (xsrfToken) {
        config.headers["X-XSRF-TOKEN"] = xsrfToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getCsrfCookie = () => api.get("/sanctum/csrf-cookie");

export default api;
