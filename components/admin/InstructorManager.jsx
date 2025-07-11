"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Loader,
  Button,
  Select,
  Pagination,
  Group,
  Text,
} from "@mantine/core";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import UserModal from "@/components/admin/UserModal";
import api from "@/lib/api";

export default function InstructorManager() {
  const { token } = useAuthStore();
  const [instructors, setInstructors] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!token) return;

    const fetchInstructors = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/admin/instructors?page=${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInstructors(res.data?.data ?? []);
        setMeta({
          current_page: res.data?.current_page ?? 1,
          last_page: res.data?.last_page ?? 1,
        });
      } catch (err) {
        console.error("Failed to fetch instructors:", err);
        setInstructors([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [token, page]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(
        `/api/admin/users/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInstructors((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleSaveUser = async (data) => {
    try {
      await api.put(`/api/admin/users/${data.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInstructors((prev) =>
        prev.map((u) => (u.id === data.id ? { ...u, ...data } : u))
      );
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInstructors((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  if (!token) {
    return (
      <Card padding="md" mt="md">
        <Loader />
        <Text mt="md" ta="center" c="dimmed">
          Authenticating instructor manager…
        </Text>
      </Card>
    );
  }

  return (
    <Card padding="md" mt="md">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Table
            striped
            highlightOnHover
            withColumnBorders
            verticalSpacing="sm"
          >
            <thead style={{ backgroundColor: "#00000" }}>
              <tr>
                <th style={{ width: "20%", textAlign: "left" }}>Name</th>
                <th style={{ width: "25%", textAlign: "left" }}>Email</th>
                <th style={{ width: "15%", textAlign: "center" }}>Courses</th>
                <th style={{ width: "20%", textAlign: "center" }}>Role</th>
                <th style={{ width: "20%", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => (
                <tr key={instructor.id}>
                  <td>{instructor.name}</td>
                  <td>{instructor.email}</td>
                  <td style={{ textAlign: "center" }}>
                    {instructor.courses_count}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Select
                      value={instructor.role}
                      style={{ marginBottom: "5px" }}
                      onChange={(value) =>
                        handleRoleChange(instructor.id, value)
                      }
                      data={["admin", "instructor", "student"]}
                      size="xs"
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Button
                      size="xs"
                      variant="light"
                      style={{ marginBottom: "5px" }}
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

          {meta?.last_page > 1 && (
            <Group justify="space-between" mt="md">
              <Text size="sm">
                Page {meta.current_page} of {meta.last_page}
              </Text>
              <Pagination
                value={page}
                onChange={setPage}
                total={meta.last_page}
                size="sm"
              />
            </Group>
          )}
        </>
      )}

      <UserModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
        onDelete={handleDeleteUser}
      />
    </Card>
  );
}
