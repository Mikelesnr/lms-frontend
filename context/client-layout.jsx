"use client";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthProvider";
import api from "@/lib/api";

export default function ClientLayout({ children }) {
  useEffect(() => {
    api.get("/sanctum/csrf-cookie").catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        defaultColorScheme="auto"
      >
        {children}
      </MantineProvider>
    </AuthProvider>
  );
}
