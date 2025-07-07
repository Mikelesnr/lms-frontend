"use client";

import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  Group,
  Title,
  Box,
  Burger,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function DashboardLayout({ title, navbar, children }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 220,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group justify="space-between" h="100%" px="md">
          <Group>
            {/* 🔄 Burger for mobile toggle */}
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label="Toggle navigation"
            />
            <Title order={4}>{title}</Title>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">{navbar}</AppShell.Navbar>

      <AppShell.Main>
        <Box>{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
}
