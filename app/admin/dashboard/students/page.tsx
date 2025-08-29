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

interface Student extends User {
  enrollments_count: number;
}

interface UserPaginationMeta {
  current_page: number;
  last_page: number;
}

function extractErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: unknown }).response === "object" &&
    (err as { response?: { data?: { message?: unknown } } }).response?.data
      ?.message
  ) {
    return String(
      (err as { response: { data: { message: unknown } } }).response.data
        .message
    );
  }
  return "An unknown error occurred.";
}

export default function AdminStudentsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [meta, setMeta] = useState<UserPaginationMeta | null>(null);
  const [page, setPage] = useState<number>(1);
  // const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    if (!authLoading && isAuthenticated && user?.role === "admin") {
      setLoading(true);
      // setError(null);
      try {
        const res = await api.get<{
          data: Student[];
          current_page: number;
          last_page: number;
        }>(`/api/admin/students?page=${page}`);
        setStudents(res.data?.data ?? []);
        setMeta({
          current_page: res.data?.current_page ?? 1,
          last_page: res.data?.last_page ?? 1,
        });
      } catch (err: unknown) {
        const errorMessage = extractErrorMessage(err);
        // setError(errorMessage);
        setStudents([]);
        setMeta(null);
        notifications.show({
          title: "Fetch Failed",
          message: errorMessage,
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    }
  }, [page, authLoading, isAuthenticated, user]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleRoleChange = async (userId: number, newRole: string) => {
    if (!isAuthenticated || user?.role !== "admin") return;

    try {
      await api.patch(`/api/admin/users/${userId}`, { role: newRole });
      setStudents((prev) =>
        prev.map((student) =>
          student.id === userId
            ? { ...student, role: newRole as User["role"] }
            : student
        )
      );
      notifications.show({
        title: "Role Updated",
        message: `User role updated to ${newRole}.`,
        color: "teal",
      });
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err);
      notifications.show({
        title: "Update Failed",
        message: errorMessage,
        color: "red",
      });
    }
  };

  const handleSaveUser = async (data: User) => {
    if (!isAuthenticated || user?.role !== "admin") return;

    try {
      await api.put(`/api/admin/users/${data.id}`, data);
      setStudents((prev) =>
        prev.map((u) =>
          u.id === data.id
            ? {
                ...u,
                ...data,
                enrollments_count: (u as Student).enrollments_count,
              }
            : u
        )
      );
      notifications.show({
        title: "User Updated",
        message: `User ${data.name} has been updated.`,
        color: "teal",
      });
      fetchStudents();
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err);
      notifications.show({
        title: "Save Failed",
        message: errorMessage,
        color: "red",
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!isAuthenticated || user?.role !== "admin") return;

    try {
      await api.delete(`/api/admin/users/${userId}`);
      setStudents((prev) => prev.filter((u) => u.id !== userId));
      notifications.show({
        title: "User Deleted",
        message: "User has been successfully deleted.",
        color: "red",
      });
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err);
      notifications.show({
        title: "Delete Failed",
        message: errorMessage,
        color: "red",
      });
    }
  };

  return (
    <Card padding="md" mt="md" radius="md">
      <Flex justify="space-between" align="center" mb="lg">
        <Title order={3}>Managed Students</Title>
      </Flex>

      {loading ? (
        <Center mih={200}>
          <Loader />
        </Center>
      ) : (
        <>
          {students.length === 0 ? (
            <Alert color="yellow" title="No Students Found" mt="md">
              There are no students to display in the system.
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
                      width: "22%",
                      textAlign: "left",
                      paddingLeft: "var(--mantine-spacing-md)",
                    }}
                  >
                    Name
                  </th>
                  <th style={{ width: "28%", textAlign: "left" }}>Email</th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Enrolled
                  </th>
                  <th style={{ width: "20%", textAlign: "center" }}>Role</th>
                  <th style={{ width: "15%", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td style={{ paddingLeft: "var(--mantine-spacing-md)" }}>
                      {student.name}
                    </td>
                    <td>{student.email}</td>
                    <td style={{ textAlign: "center" }}>
                      {student.enrollments_count}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Select
                        value={student.role}
                        onChange={(value) =>
                          handleRoleChange(student.id, value || "")
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
                          setSelectedUser(student);
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
          fetchStudents();
        }}
        user={selectedUser}
        onSave={handleSaveUser}
        onDelete={handleDeleteUser}
      />
    </Card>
  );
}
