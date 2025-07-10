"use client";

import { createContext, useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import api from "@/lib/api"; // 🔁 added for csrf fetch
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { sanctumGet } = useSanctumRequest();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      const xsrfToken = Cookies.get("XSRF-TOKEN");
      if (!xsrfToken) {
        try {
          await api.get("/sanctum/csrf-cookie", { withCredentials: true });
        } catch (err) {
          console.error("CSRF fetch failed:", err);
        }
      }

      const sessionCookie = Cookies.get("lms_learning_system_session");

      if (!sessionCookie || fetchedRef.current) {
        setLoading(false);
        return;
      }

      fetchedRef.current = true;

      try {
        const res = await sanctumGet("/api/user");
        setUser(res.data);
      } catch (err) {
        console.error("User fetch failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [sanctumGet]);

  return (
    <AuthContext.Provider value={{ user, setUser, role: user?.role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
