"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  Table,
  Loader,
  Button,
  Select,
  Pagination,
  Group,
  Text,
  Alert,
  Title,
  Flex,
  Center,
} from "@mantine/core";
import { useAuth } from "@/context/AuthContext";
import UserModal from "@/components/admin/UserModal";
import api from "@/lib/api";
import { notifications } from "@mantine/notifications";
import { User } from "@/types";
import { IconAlertCircle } from "@tabler/icons-react";

interface Instructor extends User {
  courses_count: number;
}

interface UserPaginationMeta {
  current_page: number;
  last_page: number;
}

export default function AdminInstructorsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [meta, setMeta] = useState<UserPaginationMeta | null>(null);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const extractErrorMessage = (err: unknown): string => {
    if (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof (err as { response?: { data?: { message?: string } } }).response
        ?.data?.message === "string"
    ) {
      return (err as { response?: { data?: { message?: string } } }).response!
        .data!.message!;
    } else if (err instanceof Error) {
      return err.message;
    }
    return "An unexpected error occurred.";
  };

  const fetchInstructors = useCallback(async () => {
    if (!authLoading && isAuthenticated && user?.role === "admin") {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<{
          data: Instructor[];
          current_page: number;
          last_page: number;
        }>(`/api/admin/instructors?page=${page}`);
        setInstructors(res.data?.data ?? []);
        setMeta({
          current_page: res.data?.current_page ?? 1,
          last_page: res.data?.last_page ?? 1,
        });
      } catch (err: unknown) {
        console.error("Failed to fetch instructors:", err);
        setError(extractErrorMessage(err));
        setInstructors([]);
        setMeta(null);
        notifications.show({
          title: "Fetch Failed",
          message: "Unable to load instructors. Please try again.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    }
  }, [page, authLoading, isAuthenticated, user]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  const handleRoleChange = async (userId: number, newRole: string) => {
    if (!isAuthenticated || user?.role !== "admin") return;

    try {
      await api.patch(`/api/admin/users/${userId}`, { role: newRole });
      setInstructors((prev) =>
        prev.map((instructor) =>
          instructor.id === userId
            ? { ...instructor, role: newRole as User["role"] }
            : instructor
        )
      );
      notifications.show({
        title: "Role Updated",
        message: `User role updated to ${newRole}.`,
        color: "teal",
      });
    } catch (err: unknown) {
      console.error("Failed to update role:", err);
      notifications.show({
        title: "Update Failed",
        message: extractErrorMessage(err),
        color: "red",
      });
    }
  };

  const handleSaveUser = async (data: User) => {
    if (!isAuthenticated || user?.role !== "admin") return;

    try {
      await api.put(`/api/admin/users/${data.id}`, data);
      setInstructors((prev) =>
        prev.map((u) =>
          u.id === data.id
            ? { ...u, ...data, courses_count: (u as Instructor).courses_count }
            : u
        )
      );
      notifications.show({
        title: "User Updated",
        message: `User ${data.name} has been updated.`,
        color: "teal",
      });
      fetchInstructors();
    } catch (err: unknown) {
      console.error("Failed to save user:", err);
      notifications.show({
        title: "Save Failed",
        message: extractErrorMessage(err),
        color: "red",
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!isAuthenticated || user?.role !== "admin") return;

    try {
      await api.delete(`/api/admin/users/${userId}`);
      setInstructors((prev) => prev.filter((u) => u.id !== userId));
      notifications.show({
        title: "User Deleted",
        message: "User has been successfully deleted.",
        color: "red",
      });
    } catch (err: unknown) {
      console.error("Failed to delete user:", err);
      notifications.show({
        title: "Delete Failed",
        message: extractErrorMessage(err),
        color: "red",
      });
    }
  };

  if (authLoading) {
    return (
      <Card padding="md" mt="md" radius="md">
        <Loader />
        <Text ta="center" mt="md" c="dimmed">
          Preparing instructor manager…
        </Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert
        title="Error"
        color="red"
        mt="md"
        icon={<IconAlertCircle size={16} />}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Card padding="md" mt="md" radius="md">
      <Flex justify="space-between" align="center" mb="lg">
        <Title order={3}>Managed Instructors</Title>
      </Flex>
      {loading ? (
        <Center mih={200}>
          <Loader />
        </Center>
      ) : (
        <>
          {instructors.length === 0 ? (
            <Alert color="yellow" title="No Instructors Found" mt="md">
              There are no instructors to display in the system.
            </Alert>
          ) : (
            <Table
              striped
              highlightOnHover
              withColumnBorders
              verticalSpacing="sm"
              fz="sm"
            >
              <thead>
                <tr>
                  <th
                    style={{
                      width: "20%",
                      textAlign: "left",
                      paddingLeft: "var(--mantine-spacing-md)",
                    }}
                  >
                    Name
                  </th>
                  <th style={{ width: "25%", textAlign: "left" }}>Email</th>
                  <th style={{ width: "15%", textAlign: "center" }}>Courses</th>
                  <th style={{ width: "20%", textAlign: "center" }}>Role</th>
                  <th style={{ width: "20%", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((instructor) => (
                  <tr key={instructor.id}>
                    <td style={{ paddingLeft: "var(--mantine-spacing-md)" }}>
                      {instructor.name}
                    </td>
                    <td>{instructor.email}</td>
                    <td style={{ textAlign: "center" }}>
                      {instructor.courses_count}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Select
                        value={instructor.role}
                        onChange={(value) =>
                          handleRoleChange(instructor.id, value || "")
                        }
                        data={["admin", "instructor", "student"]}
                        size="xs"
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => {
                          setSelectedUser(instructor);
                          setModalOpen(true);
                        }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {meta && meta.last_page > 1 && (
            <Group justify="space-between" mt="md">
              <Text size="sm">
                Page {meta.current_page} of {meta.last_page}
              </Text>
              <Pagination
                value={page}
                onChange={setPage}
                total={meta.last_page}
                size="sm"
                radius="md"
              />
            </Group>
          )}
        </>
      )}
      <UserModal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
          fetchInstructors();
        }}
        user={selectedUser}
        onSave={handleSaveUser}
        onDelete={handleDeleteUser}
      />
    </Card>
  );
}
