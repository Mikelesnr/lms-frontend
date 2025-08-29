"use client";

import {
  Container,
  Title,
  TextInput,
  SimpleGrid,
  Autocomplete,
  Pagination,
  Loader,
  Alert,
  Center,
  Button,
  Group,
} from "@mantine/core";
import { IconSearch, IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import CourseCard from "@/components/courses/CourseCard";
import { Course } from "@/types";

interface CourseApiResponse {
  data: Course[];
  meta?: {
    last_page: number;
  };
  last_page?: number;
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
  return "Could not load courses.";
}

export default function AllCoursesPage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<string[]>("/api/courses/categories");
        setCategoryOptions(response.data || []);
      } catch (err: unknown) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const response = await api.get<CourseApiResponse>("/api/courses/all", {
          params: {
            search: debouncedSearch,
            category,
            page,
          },
        });

        setCourses(response.data.data || []);
        const lastPage =
          response.data?.meta?.last_page ?? response.data?.last_page;
        setTotalPages(typeof lastPage === "number" ? lastPage : 1);
        setError(null);
      } catch (err: unknown) {
        console.error("Error fetching courses:", err);
        setCourses([]);
        setError(extractErrorMessage(err));
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, [debouncedSearch, category, page, isAuthenticated]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    await logout();
  };

  if (authLoading || loadingCategories || loadingCourses) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Container my="lg">
      {/* 🧭 Navigation Header */}
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <Button
            component="a"
            href="/"
            variant="subtle"
            size="xs"
            leftSection="🏠"
          >
            Home
          </Button>
          <Button
            component="a"
            href="/courses"
            variant="subtle"
            size="xs"
            leftSection="📚"
          >
            Courses
          </Button>
          {user?.role && (
            <Button
              component="a"
              href={`/${user.role}/dashboard`}
              variant="subtle"
              size="xs"
              leftSection="📊"
            >
              Dashboard
            </Button>
          )}
        </Group>

        <Group gap="xs">
          {isAuthenticated ? (
            <Button
              variant="light"
              color="red"
              size="xs"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                component="a"
                href="/auth/login"
                variant="outline"
                size="xs"
              >
                Log In
              </Button>
              <Button
                component="a"
                href="/auth/register"
                variant="filled"
                color="teal"
                size="xs"
              >
                Sign Up
              </Button>
            </>
          )}
        </Group>
      </Group>

      {/* 🔍 Filters */}
      <Title order={2} mb="md">
        📚 All Courses
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="lg">
        <TextInput
          placeholder="Search by course title"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.currentTarget.value);
          }}
        />

        <Autocomplete
          placeholder="Filter by category"
          data={categoryOptions}
          value={category}
          onChange={(value) => {
            setPage(1);
            setCategory(value || "");
          }}
          clearable
          limit={10}
          disabled={loadingCategories}
        />
      </SimpleGrid>

      {/* 📦 Results */}
      {error ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Oops!"
          color="red"
          mt="md"
        >
          {error}
        </Alert>
      ) : courses.length === 0 ? (
        <Alert color="yellow" mt="md" title="No courses found.">
          {search
            ? `No results for “${search}”. Try different keywords.`
            : "Try adjusting your filters or search terms."}
        </Alert>
      ) : (
        <>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </SimpleGrid>

          <Center mt="lg">
            <Pagination
              value={page}
              onChange={handlePageChange}
              total={totalPages}
              size="sm"
              withEdges
            />
          </Center>
        </>
      )}
    </Container>
  );
}
