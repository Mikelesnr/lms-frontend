"use client";

import { Modal, Group, Button } from "@mantine/core";
import React from "react";

interface StandardModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: () => void | Promise<void>;
  title: string;
  children: React.ReactNode;
  submitLabel?: string;
  loading?: boolean;
  size?: string;
  submitProps?: React.ComponentProps<"button">;
}

export default function StandardModal({
  opened,
  onClose,
  onSubmit,
  title,
  children,
  submitLabel = "Save",
  loading = false,
  size = "md",
  submitProps,
}: StandardModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} size={size} centered>
      {children}
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSubmit} loading={loading} {...submitProps}>
          {submitLabel}
        </Button>
      </Group>
    </Modal>
  );
}
