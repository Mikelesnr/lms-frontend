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
  Text,
  Divider,
  Button,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "@/context/AuthProvider";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ title, navbar, children }) {
  const [opened, { toggle }] = useDisclosure();
  const { user, setUser } = useAuth();
  const { sanctumPost } = useSanctumRequest();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await sanctumPost("/api/auth/logout");
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

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
      {/* Header */}
      <AppShell.Header>
        <Group justify="space-between" h="100%" px="md">
          <Group>
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

      {/* Sidebar Navigation with Profile */}
      <AppShell.Navbar p="md">
        <Box mb="xl">{navbar}</Box>

        <Box mt="auto">
          <Stack spacing="xs" mb="lg">
            <Button
              component="a"
              href="/"
              variant="subtle"
              fullWidth={false}
              leftSection="🏠"
              size="xs"
              justify="flex-start"
            >
              Home
            </Button>
            <Button
              component="a"
              href="/courses"
              variant="subtle"
              fullWidth={false}
              leftSection="📘"
              size="xs"
              justify="flex-start"
            >
              All Courses
            </Button>
          </Stack>

          <Divider my="sm" />
          <Stack spacing={4}>
            <Text size="sm" fw={600}>
              {user?.name}
            </Text>
            <Text size="xs" c="dimmed">
              {user?.email}
            </Text>
            <Text size="xs" c="gray">
              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
            </Text>

            <Button
              mt="sm"
              size="xs"
              variant="light"
              color="red"
              onClick={handleLogout}
              fullWidth
            >
              Logout
            </Button>
          </Stack>
        </Box>
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main>
        <Box>{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
}
