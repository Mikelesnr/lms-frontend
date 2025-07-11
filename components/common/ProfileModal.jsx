"use client";

import {
  Modal,
  Table,
  Button,
  TextInput,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function ProfileModal({ opened, onClose }) {
  const { user, token } = useAuthStore();
  const [editing, setEditing] = useState(false);

  const form = useForm({
    initialValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  const handleSave = async () => {
    try {
      await api.put(`/api/users/${user.id}`, form.values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated");
      setEditing(false);
      onClose();
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    try {
      await api.delete(`/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      location.href = "/goodbye";
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert("Could not delete account");
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Your Profile" centered>
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
              <Button variant="outline" onClick={() => setEditing(false)}>
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
}
