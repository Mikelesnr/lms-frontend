"use client";

import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function useLogout(tokenFromParent) {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const logout = async () => {
    if (typeof tokenFromParent === "string" && tokenFromParent.length > 0) {
      try {
        await api.post("/api/auth/logout", null, {
          headers: { Authorization: `Bearer ${tokenFromParent}` },
        });
      } catch (err) {
        console.error(
          "Logout request failed:",
          err.response?.data || err.message
        );
        notifications.show({
          title: "Logout Failed",
          message:
            "We couldn’t log you out from the server, but you’ve been signed out locally.",
          color: "orange",
        });
      }
    } else {
      console.warn("🚫 Skipping logout request: token missing or invalid.");
    }

    // Always clear user and redirect
    setUser(null);
    notifications.show({
      title: "Logged Out",
      message: "You’ve been logged out successfully.",
      color: "teal",
    });

    router.replace("/auth/login");
  };

  return logout;
}
