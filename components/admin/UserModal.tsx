"use client";

import { Modal, TextInput, Select, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import ConfirmationModal from "./ConfirmationModal"; // Adjusted path as it's a sibling
import { User } from "@/types"; // Import User type

interface UserModalProps {
  opened: boolean;
  onClose: () => void;
  user: User | null; // User can be null if creating a new user or none selected
  onSave: (data: User) => void;
  onDelete: (userId: number) => void;
}

export default function UserModal({
  opened,
  onClose,
  user,
  onSave,
  onDelete,
}: UserModalProps) {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "",
    },
    validate: {
      name: (value) => (value ? null : "Name is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      role: (value) => (value ? null : "Role is required"),
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
  }, [user, opened, form]);

  const handleSubmit = () => {
    if (form.validate().hasErrors) {
      return;
    }
    // Cast form.values to User type, assuming id is handled by onSave logic
    const userDataToSave: User = { ...form.values, id: user?.id || 0 } as User;
    onSave(userDataToSave);
    onClose();
  };

  const handleDelete = () => {
    if (user?.id) {
      onDelete(user.id);
      setConfirmDelete(false);
      onClose();
    }
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
          <Group mt="md" justify="space-between">
            {user && ( // Only show delete button if editing an existing user
              <Button
                color="red"
                variant="outline"
                onClick={() => setConfirmDelete(true)}
              >
                Delete User
              </Button>
            )}
            <Button type="submit">Save</Button>
          </Group>
        </form>
      </Modal>

      {user && ( // Only render ConfirmationModal if a user is selected
        <ConfirmationModal
          opened={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleDelete}
          message={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
        />
      )}
    </>
  );
}
