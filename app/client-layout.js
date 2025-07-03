"use client";

import { useState } from "react";
import {
  MantineProvider,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import "@mantine/core/styles.css";

export default function ClientLayout({ children }) {
  const [colorScheme, setColorScheme] = useState("light");

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
