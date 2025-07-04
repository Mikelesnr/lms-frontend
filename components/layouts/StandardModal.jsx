"use client";

import { Modal, Group, Button } from "@mantine/core";

export default function StandardModal({
  opened,
  onClose,
  onSubmit,
  title,
  children,
  submitLabel = "Save",
  loading = false,
  size = "md",
}) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} size={size} centered>
      {children}
      <Group justify="end" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSubmit} loading={loading}>
          {submitLabel}
        </Button>
      </Group>
    </Modal>
  );
}
