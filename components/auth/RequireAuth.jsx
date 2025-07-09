"use client";

import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { Loader, Center } from "@mantine/core";
import { useEffect } from "react";

export default function RequireAuth({ role, children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (role && user.role !== role))) {
      router.replace("/auth/login"); // or "/unauthorized"
    }
  }, [user, loading]);

  if (loading || !user || (role && user.role !== role)) {
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    );
  }

  return children;
}
