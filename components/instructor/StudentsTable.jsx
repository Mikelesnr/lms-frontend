"use client";

import { useEffect, useState } from "react";
import { Table, Pagination, Loader, Text, Box } from "@mantine/core";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function StudentsTable() {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("student_name");
  const [sortDirection, setSortDirection] = useState("asc");

  const { token } = useAuthStore();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/instructor/students?page=${page}&per_page=${perPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudents(res.data?.data ?? []);
        setMeta({
          current_page: res.data?.current_page ?? 1,
          last_page: res.data?.last_page ?? 1,
        });
      } catch (err) {
        console.error("Failed to load students:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page, token]);

  const sortedStudents = [...students].sort((a, b) => {
    const valA = a[sortBy] || "";
    const valB = b[sortBy] || "";
    return sortDirection === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  if (loading) return <Loader mt="md" />;

  return (
    <Box mt="md">
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th
              w="25%"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSortBy("student_name");
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
            >
              👤 Name
            </Table.Th>
            <Table.Th w="25%">📧 Email</Table.Th>
            <Table.Th w="25%">📘 Course</Table.Th>
            <Table.Th
              w="25%"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSortBy("enrolled_at");
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
            >
              📅 Enrolled
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {sortedStudents.length > 0 ? (
            sortedStudents.map((student, i) => (
              <Table.Tr key={i}>
                <Table.Td
                  w="25%"
                  style={{ textAlign: "left", padding: "12px" }}
                >
                  {student.student_name}
                </Table.Td>
                <Table.Td
                  w="25%"
                  style={{ textAlign: "left", padding: "12px" }}
                >
                  {student.student_email}
                </Table.Td>
                <Table.Td
                  w="25%"
                  style={{ textAlign: "left", padding: "12px" }}
                >
                  {student.course_title}
                </Table.Td>
                <Table.Td
                  w="25%"
                  style={{ textAlign: "left", padding: "12px" }}
                >
                  {new Date(student.enrolled_at).toLocaleDateString()}
                </Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text align="center" c="dimmed" py="md">
                  No students enrolled yet.
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      <Pagination
        value={meta.current_page}
        onChange={setPage}
        total={meta.last_page}
        mt="lg"
        radius="md"
        color="indigo"
      />
    </Box>
  );
}
