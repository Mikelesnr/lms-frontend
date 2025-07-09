"use client";

import { useCallback } from "react";
import api from "@/lib/api";
import Cookies from "js-cookie";
import axios from "axios";

export default function useSanctumRequest() {
  const ensureCSRF = useCallback(async () => {
    const token = Cookies.get("XSRF-TOKEN");
    if (!token) {
      await axios.get("https://lms-api-i62r.onrender.com/sanctum/csrf-cookie", {
        withCredentials: true,
      });
    }
  }, []);

  const buildHeaders = () => {
    const token = Cookies.get("XSRF-TOKEN") || "";
    return {
      withCredentials: true,
      headers: {
        "X-XSRF-TOKEN": decodeURIComponent(token),
      },
    };
  };

  const sanctumGet = useCallback(
    async (url, config = {}) => {
      await ensureCSRF();
      return api.get(url, {
        ...buildHeaders(),
        ...config,
        headers: {
          ...buildHeaders().headers,
          ...(config.headers || {}),
        },
      });
    },
    [ensureCSRF]
  );

  const sanctumPost = useCallback(
    async (url, data = {}, config = {}) => {
      await ensureCSRF();
      return api.post(url, data, {
        ...buildHeaders(),
        ...config,
        headers: {
          ...buildHeaders().headers,
          ...(config.headers || {}),
        },
      });
    },
    [ensureCSRF]
  );

  const sanctumPut = useCallback(
    async (url, data = {}, config = {}) => {
      await ensureCSRF();
      return api.put(url, data, {
        ...buildHeaders(),
        ...config,
        headers: {
          ...buildHeaders().headers,
          ...(config.headers || {}),
        },
      });
    },
    [ensureCSRF]
  );

  const sanctumPatch = useCallback(
    async (url, data = {}, config = {}) => {
      await ensureCSRF();
      return api.patch(url, data, {
        ...buildHeaders(),
        ...config,
        headers: {
          ...buildHeaders().headers,
          ...(config.headers || {}),
        },
      });
    },
    [ensureCSRF]
  );

  const sanctumDelete = useCallback(
    async (url, config = {}) => {
      await ensureCSRF();
      return api.delete(url, {
        ...buildHeaders(),
        ...config,
        headers: {
          ...buildHeaders().headers,
          ...(config.headers || {}),
        },
      });
    },
    [ensureCSRF]
  );

  return {
    sanctumGet,
    sanctumPost,
    sanctumPut,
    sanctumPatch,
    sanctumDelete,
  };
}
