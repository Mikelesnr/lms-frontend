"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  Pagination,
  Loader,
  Text,
  Card,
  Alert,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { notifications } from "@mantine/notifications";
import { PaginationMeta } from "@/types";

interface InstructorStudent {
  student_name: string;
  student_email: string;
  course_title: string;
  enrolled_at: string;
}

function extractErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: unknown }).response === "object"
  ) {
    const response = (err as { response?: { data?: unknown } }).response;
    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      typeof (response as { data?: unknown }).data === "object"
    ) {
      const data = (response as { data?: Record<string, unknown> }).data;
      if (data?.message && typeof data.message === "string") {
        return data.message;
      }
    }
  }
  return "Failed to load student data.";
}

export default function InstructorStudentsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [page, setPage] = useState<number>(1);
  const perPage = 10;
  const [students, setStudents] = useState<InstructorStudent[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof InstructorStudent>("student_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const fetchStudents = useCallback(async () => {
    if (!authLoading && isAuthenticated && user?.role === "instructor") {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await api.get<{
          data: InstructorStudent[];
          meta: PaginationMeta;
        }>(`/api/instructor/students?page=${page}&per_page=${perPage}`);
        setStudents(res.data?.data ?? []);
        setMeta(res.data?.meta ?? null);
        notifications.show({
          title: "Students Loaded",
          message: `Found ${res.data?.meta?.total ?? 0} students.`,
          color: "teal",
          autoClose: 3000,
        });
      } catch (err: unknown) {
        console.error("Failed to load students:", err);
        setStudents([]);
        setMeta(null);
        const message = extractErrorMessage(err);
        setLoadError(message);
        notifications.show({
          title: "Students Load Failed",
          message,
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    }
  }, [authLoading, isAuthenticated, user, page]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const sortedStudents = [...students].sort((a, b) => {
    const valA = a[sortBy] || "";
    const valB = b[sortBy] || "";

    if (sortBy === "enrolled_at") {
      const dateA = new Date(valA as string).getTime();
      const dateB = new Date(valB as string).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const handleSortClick = (field: keyof InstructorStudent) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  if (authLoading || loading) {
    return <Loader mt="xl" />;
  }

  if (loadError) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error loading students"
        color="red"
        mt="md"
      >
        {loadError}
      </Alert>
    );
  }

  return (
    <Card padding="md" mt="md">
      <Title order={2} mb="md">
        👥 My Students
      </Title>
      {sortedStudents.length === 0 ? (
        <Text c="dimmed">No students enrolled in your courses yet.</Text>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th
                w="25%"
                style={{ cursor: "pointer" }}
                onClick={() => handleSortClick("student_name")}
              >
                Name{" "}
                {sortBy === "student_name" &&
                  (sortDirection === "asc" ? (
                    <IconSortAscending size={14} />
                  ) : (
                    <IconSortDescending size={14} />
                  ))}
              </Table.Th>
              <Table.Th w="25%">Email</Table.Th>
              <Table.Th w="25%">Course</Table.Th>
              <Table.Th
                w="25%"
                style={{ cursor: "pointer" }}
                onClick={() => handleSortClick("enrolled_at")}
              >
                Enrolled{" "}
                {sortBy === "enrolled_at" &&
                  (sortDirection === "asc" ? (
                    <IconSortAscending size={14} />
                  ) : (
                    <IconSortDescending size={14} />
                  ))}
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {sortedStudents.map((student, i) => (
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
      )}

      {meta && meta.last_page > 1 && (
        <Pagination
          value={meta.current_page}
          onChange={setPage}
          total={meta.last_page}
          mt="lg"
          radius="md"
          color="indigo"
        />
      )}
    </Card>
  );
}
