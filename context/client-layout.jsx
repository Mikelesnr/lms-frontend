"use client";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useEffect } from "react";
import api from "@/lib/api";

export default function ClientLayout({ children }) {
  useEffect(() => {
    api.get("/sanctum/csrf-cookie").catch(console.error);
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      defaultColorScheme="auto"
    >
      {children}
    </MantineProvider>
  );
}
