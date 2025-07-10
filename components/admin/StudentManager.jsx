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
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";
import UserModal from "@/components/admin/UserModal";

export default function StudentManager() {
  const [students, setStudents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  const { sanctumGet, sanctumPatch, sanctumPut, sanctumDelete } =
    useSanctumRequest();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await sanctumGet(`/api/admin/students?page=${page}`);
        setStudents(res.data?.data ?? []);
        setMeta({
          current_page: res.data?.current_page ?? 1,
          last_page: res.data?.last_page ?? 1,
        });
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setStudents([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page, sanctumGet]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await sanctumPatch(`/api/admin/users/${userId}`, { role: newRole });
      setStudents((prev) =>
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
      await sanctumPut(`/api/admin/users/${data.id}`, data);
      setStudents((prev) =>
        prev.map((u) => (u.id === data.id ? { ...u, ...data } : u))
      );
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await sanctumDelete(`/api/admin/users/${userId}`);
      setStudents((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <Card padding="md" mt="md">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Table highlightOnHover withColumnBorders>
            <thead>
              <tr>
                <th style={{ width: "25%", textAlign: "left" }}>Name</th>
                <th style={{ width: "25%", textAlign: "left" }}>Email</th>
                <th style={{ width: "20%", textAlign: "left" }}>Enrolled</th>
                <th style={{ width: "20%", textAlign: "left" }}>Role</th>
                <th style={{ width: "10%", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.enrollments_count}</td>
                  <td>
                    <Select
                      value={student.role}
                      onChange={(value) => handleRoleChange(student.id, value)}
                      data={["admin", "instructor", "student"]}
                      size="xs"
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Button
                      size="xs"
                      variant="light"
                      style={{ margin: "5px 10px" }}
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
