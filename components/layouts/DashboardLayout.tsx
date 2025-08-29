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
import { useState } from "react";
import ProfileModal from "@/components/common/ProfileModal";
import { useAuth } from "@/context/AuthContext";

interface DashboardLayoutProps {
  title: string;
  navbar: React.ReactNode;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  navbar,
  children,
}) => {
  const [opened, { toggle }] = useDisclosure();
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);

  const { user, logout, fetchUser } = useAuth();

  const handleProfileModalClose = () => {
    setProfileModalOpen(false);
    fetchUser();
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
      <AppShellHeader>
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
      </AppShellHeader>

      <AppShellNavbar p="md">
        <Box mb="xl">{navbar}</Box>

        <Box mt="auto">
          <Stack gap="xs" mb="lg">
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

          <Stack gap={4}>
            <Text size="sm" fw={600}>
              {user?.name}
            </Text>
            <Text size="xs" c="dimmed">
              {user?.email}
            </Text>
            {user?.role && (
              <Text size="xs" c="gray">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Text>
            )}

            <Button
              mt="xs"
              size="xs"
              variant="light"
              fullWidth
              onClick={() => setProfileModalOpen(true)}
            >
              Edit Profile
            </Button>

            <Button
              mt="sm"
              size="xs"
              variant="light"
              color="red"
              onClick={() => logout()}
              fullWidth
            >
              Logout
            </Button>
          </Stack>
        </Box>
      </AppShellNavbar>

      <AppShellMain>
        <Box>{children}</Box>
      </AppShellMain>

      <ProfileModal
        opened={profileModalOpen}
        onClose={handleProfileModalClose}
      />
    </AppShell>
  );
};

export default DashboardLayout;
