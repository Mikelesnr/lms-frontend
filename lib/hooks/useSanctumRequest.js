"use client";

import { useCallback, useRef, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import api from "@/lib/api";

export default function useSanctumRequest() {
  const isFetchingCSRF = useRef(false);

  const ensureCSRF = useCallback(async () => {
    const token = Cookies.get("XSRF-TOKEN");
    if (!token && !isFetchingCSRF.current) {
      isFetchingCSRF.current = true;
      try {
        await axios.get(
          "https://lms-frontend-6qso.onrender.com/sanctum/csrf-cookie",
          {
            withCredentials: true,
          }
        );
      } catch (err) {
        console.error("CSRF fetch failed:", err);
      } finally {
        isFetchingCSRF.current = false;
      }
    }
  }, []);

  const buildHeaders = useCallback(() => {
    const token = Cookies.get("XSRF-TOKEN") || "";
    return {
      withCredentials: true,
      headers: {
        "X-XSRF-TOKEN": decodeURIComponent(token),
      },
    };
  }, []);

  const createRequest = useCallback(
    (method) =>
      async (url, dataOrConfig = {}, config = {}) => {
        await ensureCSRF();

        // Determine if method is GET or DELETE → skip request body
        const hasBody = !["get", "delete"].includes(method);
        const data = hasBody ? dataOrConfig : undefined;
        const finalConfig = hasBody ? config : dataOrConfig;

        return api[method](url, ...(hasBody ? [data] : []), {
          ...buildHeaders(),
          ...finalConfig,
          headers: {
            ...buildHeaders().headers,
            ...(finalConfig.headers || {}),
          },
        });
      },
    [ensureCSRF, buildHeaders]
  );

  return useMemo(() => {
    return {
      sanctumGet: createRequest("get"),
      sanctumPost: createRequest("post"),
      sanctumPut: createRequest("put"),
      sanctumPatch: createRequest("patch"),
      sanctumDelete: createRequest("delete"),
    };
  }, [createRequest]);
}
