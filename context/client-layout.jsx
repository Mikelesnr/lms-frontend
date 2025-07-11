"use client";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import RootAuthLoader from "@/lib/bootstrap/RootAuthLoader"; // ⬅️ Import the bootstrapper

export default function ClientLayout({ children }) {
  return (
    <>
      <RootAuthLoader />
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        defaultColorScheme="auto"
      >
        {children}
      </MantineProvider>
    </>
  );
}
