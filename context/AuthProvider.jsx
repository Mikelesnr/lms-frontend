"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { sanctumGet } = useSanctumRequest();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await sanctumGet("/api/user");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, role: user?.role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useSanctumRequest();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Button color="red" onClick={handleLogout}>
      Logout
    </Button>
  );
}
