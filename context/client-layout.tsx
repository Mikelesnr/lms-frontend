"use client";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { AuthProvider } from "@/context/AuthContext";
import { ChildrenProps } from "@/types";

export default function ClientLayout({ children }: ChildrenProps) {
  return (
    <AuthProvider>
      <MantineProvider defaultColorScheme="auto">{children}</MantineProvider>
    </AuthProvider>
  );
}
