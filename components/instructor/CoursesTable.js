"use client";

import { Table, Button, Group } from "@mantine/core";

export default function CoursesTable({ data }) {
  return (
    <Table striped highlightOnHover withTableBorder>
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>Course Name</th>
          <th style={{ textAlign: "left" }}>Enrolled</th>
          <th style={{ textAlign: "left" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((course) => (
          <tr key={course.id}>
            <td>{course.title}</td>
            <td>{course.students}</td>
            <td>
              <Group gap="xs">
                <Button size="xs" variant="light">
                  Edit
                </Button>
                <Button size="xs" color="red" variant="light">
                  Delete
                </Button>
              </Group>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
