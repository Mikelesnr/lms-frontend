import { Modal, Text, Button, Group } from "@mantine/core";
import React from "react"; // Explicitly import React

interface ConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title?: string; // Optional title for more flexibility
}

export default function ConfirmationModal({
  opened,
  onClose,
  onConfirm,
  message,
  title = "Confirm Action", // Default title
}: ConfirmationModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Text>{message}</Text>
      <Group mt="lg" justify="flex-end">
        {" "}
        {/* Changed position to justify="flex-end" */}
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm}>
          Confirm
        </Button>
      </Group>
    </Modal>
  );
}
