"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuth";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function useLogout() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { sanctumPost } = useSanctumRequest();

  const logout = async () => {
    try {
      await sanctumPost("/api/auth/logout");
      setUser(null);
      router.replace("/auth/login"); // ✅ optional: redirect after logout
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  return logout;
}
