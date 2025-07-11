"use client";

import { useEffect } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { usePathname } from "next/navigation";

export default function RootAuthLoader() {
  const { setUser, token, logout } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    const bootstrapAuth = async () => {
      // 🛡️ Skip unauthenticated routes
      const unauthRoutes = [
        "/auth/login",
        "/auth/register",
        "/auth/password-reset",
        "/auth/forgot-password",
      ];

      if (!token || unauthRoutes.some((route) => pathname.startsWith(route))) {
        console.info("🧭 Skipping auth bootstrap on public route.");
        return;
      }

      try {
        const res = await api.get("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error(
          "❌ AuthLoader: Failed to authenticate",
          err.response?.data || err.message
        );
        logout();
      }
    };

    bootstrapAuth();
  }, [token, pathname]);

  return null;
}
