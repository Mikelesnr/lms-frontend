"use client";

import {
  Modal,
  Table,
  Button,
  TextInput,
  Group,
  Stack,
  Text,
  Alert,
} from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { IconAlertCircle } from "@tabler/icons-react";
import { modals } from "@mantine/modals";

interface ProfileModalProps {
  opened: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ opened, onClose }) => {
  const { user, logout, fetchUser, isAuthenticated } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const form = useForm({
    initialValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
    validate: {
      name: (value) => (value ? null : "Name is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  useEffect(() => {
    if (opened && user && !initializedRef.current) {
      form.setValues({
        name: user.name ?? "",
        email: user.email ?? "",
      });
      setEditing(false);
      setSaveError(null);
      initializedRef.current = true;
    }
  }, [opened, user]);

  useEffect(() => {
    if (!opened) {
      initializedRef.current = false;
      setEditing(false);
      setSaveError(null);
      setTimeout(() => form.reset(), 0); // avoid sync loop
    }
  }, [opened]);

  function extractErrorMessage(err: unknown): string {
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message;

    if (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof (err as { response?: unknown }).response === "object"
    ) {
      const response = (err as { response?: { data?: unknown } }).response;
      if (
        response &&
        "data" in response &&
        typeof response.data === "object" &&
        response.data !== null &&
        "message" in response.data &&
        typeof (response.data as { message?: unknown }).message === "string"
      ) {
        return (response.data as { message: string }).message;
      }
    }

    return "An unexpected error occurred.";
  }

  const handleSave = async (values: typeof form.values) => {
    setSaveError(null);
    if (!user) {
      notifications.show({
        title: "Error",
        message: "User data not available. Please log in.",
        color: "red",
      });
      return;
    }

    try {
      await api.put(`/api/users/${user.id}`, values);
      notifications.show({
        title: "Profile Updated",
        message: "Your profile has been successfully updated.",
        color: "teal",
      });
      setEditing(false);
      if (fetchUser) {
        await fetchUser();
      } else {
        console.warn("fetchUser function not available in AuthContext.");
      }
      onClose();
    } catch (err: unknown) {
      const message = extractErrorMessage(err);
      console.error("Failed to update profile:", err);
      setSaveError(message);
      notifications.show({
        title: "Update Failed",
        message,
        color: "red",
      });
    }
  };

  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Delete Your Account",
      centered: true,
      children: (
        <Text size="sm">
          Are you absolutely sure you want to delete your account? This action
          is irreversible.
        </Text>
      ),
      labels: { confirm: "Delete account", cancel: "No, keep my account" },
      confirmProps: { color: "red" },
      onCancel: () =>
        notifications.show({
          title: "Deletion Cancelled",
          message: "Your account has not been deleted.",
          color: "gray",
        }),
      onConfirm: async () => {
        if (!user) return;

        try {
          await api.delete(`/api/users/${user.id}`);
          notifications.show({
            title: "Account Deleted",
            message: "Your account has been successfully deleted. Goodbye!",
            color: "green",
          });
          logout();
        } catch (err: unknown) {
          const message = extractErrorMessage(err);
          console.error("Failed to delete account:", err);
          notifications.show({
            title: "Deletion Failed",
            message,
            color: "red",
          });
        }
      },
    });
  };

  if (!isAuthenticated || !user) return null;

  return (
    <Modal opened={opened} onClose={onClose} title="Your Profile" centered>
      {saveError && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Save Error"
          color="red"
          mb="md"
        >
          {saveError}
        </Alert>
      )}
      {editing ? (
        <form onSubmit={form.onSubmit(handleSave)}>
          <Stack>
            <TextInput label="Name" required {...form.getInputProps("name")} />
            <TextInput
              label="Email"
              required
              {...form.getInputProps("email")}
            />
            <Group justify="space-between" mt="md">
              <Button type="submit">Save</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  form.reset();
                  setSaveError(null);
                }}
              >
                Cancel
              </Button>
            </Group>
          </Stack>
        </form>
      ) : (
        <>
          <Table highlightOnHover withColumnBorders verticalSpacing="sm">
            <tbody>
              <tr>
                <td>
                  <Text fw={500}>Name</Text>
                </td>
                <td>{user.name}</td>
              </tr>
              <tr>
                <td>
                  <Text fw={500}>Email</Text>
                </td>
                <td>{user.email}</td>
              </tr>
              {user.role && (
                <tr>
                  <td>
                    <Text fw={500}>Role</Text>
                  </td>
                  <td>{user.role}</td>
                </tr>
              )}
            </tbody>
          </Table>

          <Group justify="space-between" mt="md">
            <Button onClick={() => setEditing(true)}>Edit</Button>
            <Button color="red" variant="outline" onClick={handleDelete}>
              Delete Profile
            </Button>
          </Group>
        </>
      )}
    </Modal>
  );
};

export default ProfileModal;
