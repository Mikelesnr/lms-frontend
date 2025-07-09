"use client";

import api from "@/lib/api";
import Cookies from "js-cookie";
import axios from "axios";

export default function useSanctumRequest() {
  const ensureCSRF = async () => {
    const token = Cookies.get("XSRF-TOKEN");
    if (!token) {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });
    }
  };

  const sanctumPost = async (url, data = {}, config = {}) => {
    await ensureCSRF();
    const token = Cookies.get("XSRF-TOKEN") || "";
    return api.post(url, data, {
      withCredentials: true,
      headers: {
        "X-XSRF-TOKEN": decodeURIComponent(token),
        ...(config.headers || {}),
      },
      ...config,
    });
  };

  const sanctumGet = async (url, config = {}) => {
    await ensureCSRF();
    const token = Cookies.get("XSRF-TOKEN") || "";
    return api.get(url, {
      withCredentials: true,
      headers: {
        "X-XSRF-TOKEN": decodeURIComponent(token),
        ...(config.headers || {}),
      },
      ...config,
    });
  };

  const sanctumPut = async (url, data = {}, config = {}) => {
    await ensureCSRF();
    const token = Cookies.get("XSRF-TOKEN") || "";
    return api.put(url, data, {
      withCredentials: true,
      headers: {
        "X-XSRF-TOKEN": decodeURIComponent(token),
        ...(config.headers || {}),
      },
      ...config,
    });
  };

  const sanctumPatch = async (url, data = {}, config = {}) => {
    await ensureCSRF();
    const token = Cookies.get("XSRF-TOKEN") || "";
    return api.patch(url, data, {
      withCredentials: true,
      headers: {
        "X-XSRF-TOKEN": decodeURIComponent(token),
        ...(config.headers || {}),
      },
      ...config,
    });
  };

  const sanctumDelete = async (url, config = {}) => {
    await ensureCSRF();
    const token = Cookies.get("XSRF-TOKEN") || "";
    return api.delete(url, {
      withCredentials: true,
      headers: {
        "X-XSRF-TOKEN": decodeURIComponent(token),
        ...(config.headers || {}),
      },
      ...config,
    });
  };

  return { sanctumPost, sanctumGet, sanctumPut, sanctumPatch, sanctumDelete };
}
