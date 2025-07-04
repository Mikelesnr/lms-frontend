"use client";

import { useState, useEffect } from "react";
import {
  MantineProvider,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import "@mantine/core/styles.css";
import api from "@/lib/api";

export default function ClientLayout({ children }) {
  const [colorScheme, setColorScheme] = useState("light");

  useEffect(() => {
    // ✅ Fetch CSRF cookie once at app load
    api.get("/sanctum/csrf-cookie").catch((err) => {
      console.error("Failed to fetch CSRF cookie:", err);
    });
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      defaultColorScheme="auto"
      theme={{ colorScheme }}
    >
      {children}
    </MantineProvider>
  );
}
