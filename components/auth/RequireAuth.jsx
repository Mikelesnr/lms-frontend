"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader, Center } from "@mantine/core";
import { useAuthStore } from "@/lib/stores/useAuthStore";

export default function RequireAuth({ role, children }) {
  const { user, token } = useAuthStore();
  const router = useRouter();

  const loading = !user && !token;
  const unauthorized = !user || !token || (role && user?.role !== role);

  useEffect(() => {
    if (!loading && unauthorized) {
      router.replace("/auth/login");
    }
  }, [loading, unauthorized, router]);

  if (loading || unauthorized) {
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    );
  }

  return children;
}
