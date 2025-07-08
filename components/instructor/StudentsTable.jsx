"use client";

import { useState } from "react";
import { Table, Pagination, Loader, Text, Box } from "@mantine/core";
import useInstructorStudents from "@/lib/hooks/useInstructorStudents";

export default function StudentsTable() {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const { students, meta, loading } = useInstructorStudents(page, perPage);

  if (loading) return <Loader mt="md" />;

  return (
    <Box mt="md">
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>👤 Name</Table.Th>
            <Table.Th>📧 Email</Table.Th>
            <Table.Th>📘 Course</Table.Th>
            <Table.Th>📅 Enrolled</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {students.map((student, i) => (
            <Table.Tr key={i}>
              <Table.Td>{student.student_name}</Table.Td>
              <Table.Td>{student.student_email}</Table.Td>
              <Table.Td>{student.course_title}</Table.Td>
              <Table.Td>
                {new Date(student.enrolled_at).toLocaleDateString()}
              </Table.Td>
            </Table.Tr>
          ))}
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
