import { Modal, Text, Button, Group } from "@mantine/core";

export default function ConfirmationModal({
  opened,
  onClose,
  onConfirm,
  message,
}) {
  return (
    <Modal opened={opened} onClose={onClose} title="Confirm Delete" centered>
      <Text>{message}</Text>
      <Group mt="lg" position="right">
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
