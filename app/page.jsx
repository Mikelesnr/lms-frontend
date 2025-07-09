"use client";

import {
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
  Divider,
  Center,
  Stack,
  Group,
} from "@mantine/core";
import {
  IconBook2,
  IconRocket,
  IconUserPlus,
  IconArrowRight,
  IconLogin,
  IconLogout,
} from "@tabler/icons-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import FeaturedCourses from "@/components/courses/FeaturedCourses";
import useLogout from "@/lib/hooks/useLogout";

export default function HomePage() {
  const { user, loading } = useAuth();
  const logout = useLogout();

  if (loading) return null;

  return (
    <Container size="lg" pt="xl">
      {/* Hero */}
      <Title order={1} fw={900} ta="center">
        Empower Your Learning Journey 🚀
      </Title>
      <Text ta="center" mt="sm" mb="xl" c="dimmed">
        Explore industry-ready courses in coding, business, and beyond. Learn at
        your own pace. Track your progress. Build your future.
      </Text>

      {/* Auth Actions */}
      {!user ? (
        <Stack align="center" spacing="sm" mb="xl">
          <Button
            component={Link}
            href="/auth/register"
            size="md"
            radius="md"
            leftSection={<IconUserPlus size={18} />}
            variant="filled"
            color="teal"
          >
            Sign Up & Start Learning
          </Button>
          <Button
            component={Link}
            href="/auth/login"
            variant="subtle"
            size="xs"
            leftSection={<IconLogin size={16} />}
          >
            Already have an account? Log in
          </Button>
        </Stack>
      ) : (
        <Center mb="xl">
          <Group gap="xs">
            <Button
              component={Link}
              href={`/dashboard/${user.role}`}
              variant="light"
              color="blue"
              leftSection="📊"
            >
              Dashboard
            </Button>
            <Button
              color="red"
              onClick={logout}
              leftSection={<IconLogout size={16} />}
            >
              Logout
            </Button>
          </Group>
        </Center>
      )}

      {/* Featured Courses */}
      <FeaturedCourses />

      {/* View All Courses CTA */}
      <Center mt="lg">
        <Button
          component={Link}
          href="/courses"
          variant="outline"
          rightSection={<IconArrowRight size={18} />}
        >
          View All Courses
        </Button>
      </Center>

      {/* Benefits Section */}
      <Divider label="📦 Why Choose Us" labelPosition="center" my="xl" />

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        <Benefit
          icon={<IconBook2 size={32} />}
          title="Expert Content"
          description="Courses built by experienced instructors from industry and academia."
        />
        <Benefit
          icon={<IconRocket size={32} />}
          title="Track Your Progress"
          description="Real-time quiz feedback and progress tracking keep you motivated."
        />
        <Benefit
          icon={<IconUserPlus size={32} />}
          title="Flexible & Accessible"
          description="Learn at your own pace on any device, anywhere in the world."
        />
      </SimpleGrid>
    </Container>
  );
}

function Benefit({ icon, title, description }) {
  return (
    <div>
      {icon}
      <Title order={4} mt="md">
        {title}
      </Title>
      <Text c="dimmed" size="sm">
        {description}
      </Text>
    </div>
  );
}
