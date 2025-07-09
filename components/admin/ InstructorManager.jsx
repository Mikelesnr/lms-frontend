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

export default function InstructorManager() {
  const [instructors, setInstructors] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  const { sanctumGet, sanctumPatch, sanctumPut, sanctumDelete } =
    useSanctumRequest();

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      try {
        const res = await sanctumGet(`/api/admin/instructors?page=${page}`);
        setInstructors(res.data.data);
        setMeta({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
        });
      } catch (err) {
        console.error("Failed to fetch instructors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [page]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await sanctumPatch(`/api/admin/users/${userId}`, { role: newRole });
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
      await sanctumPut(`/api/admin/users/${data.id}`, data);
      setInstructors((prev) =>
        prev.map((u) => (u.id === data.id ? { ...u, ...data } : u))
      );
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await sanctumDelete(`/api/admin/users/${userId}`);
      setInstructors((prev) => prev.filter((u) => u.id !== userId));
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
                <th style={{ width: "25%", textAlign: "left" }}>Courses</th>
                <th style={{ width: "25%", textAlign: "left" }}>Role Change</th>
                <th style={{ width: "25%", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => (
                <tr key={instructor.id}>
                  <td>{instructor.name}</td>
                  <td>{instructor.email}</td>
                  <td>{instructor.courses_count}</td>
                  <td>
                    <Select
                      value={instructor.role}
                      onChange={(value) =>
                        handleRoleChange(instructor.id, value)
                      }
                      data={["admin", "instructor", "student"]}
                      size="xs"
                    />
                  </td>
                  <td>
                    <Button
                      size="xs"
                      variant="light"
                      style={{ margin: "5px 10px" }}
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
