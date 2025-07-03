"use client";
import { Table, Text } from "@mantine/core";

export default function EnrolledCoursesTable() {
  const courses = [
    { id: 1, title: "React Basics", progress: "75%" },
    { id: 2, title: "Laravel Crash Course", progress: "40%" },
  ];

  if (courses.length === 0)
    return <Text c="dimmed">You’re not enrolled in any courses yet.</Text>;

  return (
    <Table striped withTableBorder highlightOnHover mt="md">
      <thead>
        <tr>
          <th>Course</th>
          <th>Progress</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id}>
            <td>{course.title}</td>
            <td>{course.progress}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
