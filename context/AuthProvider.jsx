"use client";

import { createContext, useEffect, useState } from "react";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { sanctumGet } = useSanctumRequest();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await sanctumGet("/api/user");
        setUser(res.data);
      } catch {
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
