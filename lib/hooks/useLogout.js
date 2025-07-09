"use client";

import { useRouter, usePathname } from "next/navigation"; // ✅ include usePathname
import { useAuth } from "@/context/AuthProvider";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function useLogout() {
  const router = useRouter();
  const pathname = usePathname(); // ✅ no more ReferenceError
  const { setUser } = useAuth();
  const { sanctumPost } = useSanctumRequest();

  const logout = async () => {
    try {
      await sanctumPost("/api/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  return logout;
}
