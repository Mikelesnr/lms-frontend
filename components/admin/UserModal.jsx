"use client";

import {
  Modal,
  TextInput,
  PasswordInput,
  Select,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import ConfirmationModal from "./ConfirmationModal"; // Ensure this file exists

export default function UserModal({ opened, onClose, user, onSave, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      role: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
      });
    } else {
      form.reset();
    }
  }, [user, opened]);

  const handleSubmit = () => {
    onSave({ ...form.values, id: user?.id });
    onClose();
  };

  const handleDelete = () => {
    onDelete(user.id);
    setConfirmDelete(false);
    onClose();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={user ? "Edit User" : "New User"}
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Name" required {...form.getInputProps("name")} />
          <TextInput label="Email" required {...form.getInputProps("email")} />
          <Select
            label="Role"
            data={["admin", "instructor", "student"]}
            required
            {...form.getInputProps("role")}
          />
          <Group mt="md" position="apart">
            {user && (
              <Button
                color="red"
                variant="outline"
                onClick={() => setConfirmDelete(true)}
              >
                Delete User
              </Button>
            )}
            <Button
              variant="outline"
              color="blue"
              onClick={async () => {
                try {
                  await sanctumPost(
                    `/api/admin/users/${user.id}/send-password-reset`
                  );
                  alert(`Reset email sent to ${user.email}`);
                } catch (err) {
                  console.error("Reset email failed", err);
                  alert("Could not send reset email.");
                }
              }}
            >
              Send Reset Email
            </Button>

            <Button type="submit">Save</Button>
          </Group>
        </form>
      </Modal>

      <ConfirmationModal
        opened={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        message={`Are you sure you want to delete ${user?.name}?`}
      />
    </>
  );
}
