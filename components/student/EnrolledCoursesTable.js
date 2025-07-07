import { Table, Progress, Button, Flex, Text } from "@mantine/core";

export default function EnrolledCoursesTable({ courses = [] }) {
  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: 10 }}>Course</th>
          <th style={{ textAlign: "left", padding: 10 }}>Instructor</th>
          <th style={{ textAlign: "left", padding: 10 }}>Progress</th>
          <th style={{ textAlign: "left", padding: 10, padding: "0 30px" }}>
            Continue
          </th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => {
          const progress = course.progress || 0; // fallback
          const nextLesson = course.next_lesson;

          return (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.instructor?.name}</td>
              <td>
                <Flex align="center" gap="sm" style={{ maxWidth: 200 }}>
                  <Progress
                    value={course.progress}
                    size="sm"
                    radius="xl"
                    w="100%"
                    color={course.progress === 100 ? "green" : "blue"}
                  />
                  <Text
                    size="sm"
                    c={course.progress === 100 ? "green" : "dimmed"}
                    fw={500}
                  >
                    {course.progress}%
                  </Text>
                </Flex>
              </td>
              <td style={{ alignContent: "center" }}>
                {course.progress === 100 ? (
                  <Text size="sm" color="green">
                    🎉 Completed
                  </Text>
                ) : (
                  <Button
                    size="xs"
                    component="a"
                    style={{ textAlign: "center", margin: "5px 30px" }}
                    href={`/lessons/${course.next_lesson?.id}`}
                    variant="light"
                    color="blue"
                  >
                    Resume
                  </Button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
