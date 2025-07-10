"use client";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { AuthProvider } from "@/context/AuthProvider";

export default function ClientLayout({ children }) {
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
