"use client";

import { useRouter } from "next/navigation";
import { Container, Title, Text, Button, Stack } from "@mantine/core";

export default function GoodbyePage() {
  const router = useRouter();

  return (
    <Container size="sm" pt="xl">
      <Stack spacing="md" align="center">
        <Title order={2}>👋 Goodbye</Title>
        <Text size="md" ta="center" c="dimmed">
          Your account has been deleted. We're sad to see you go, but you're
          always welcome back.
        </Text>
        <Button onClick={() => router.push("/")} size="sm">
          Go to Homepage
        </Button>
      </Stack>
    </Container>
  );
}
