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
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import useLogout from "@/lib/hooks/useLogout";
import CourseCard from "@/components/courses/CourseCard";

export default function AllCoursesPage() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLogout(token); // ✅ Pass token into hook

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/courses/categories");
        setCategoryOptions(response.data || []);
      } catch (err) {
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
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await api.get("/api/courses/all", {
          headers,
          params: {
            search: debouncedSearch,
            category,
            page,
          },
        });

        setCourses(response.data.data || []);
        const lastPage =
          response.data?.meta?.last_page ?? response.data?.last_page;
        setTotalPages(Number.isInteger(lastPage) ? lastPage : 1);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
        setError("Could not load courses.");
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, [debouncedSearch, category, page, token]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    await logout();
    if (pathname.startsWith("/dashboard")) {
      router.push("/auth/login");
    }
  };

  return (
    <Container my="lg">
      {/* 🧭 Navigation Header */}
      <Group justify="space-between" mb="md">
        <Group spacing="xs">
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
              href={`/dashboard/${user.role}`}
              variant="subtle"
              size="xs"
              leftSection="📊"
            >
              Dashboard
            </Button>
          )}
        </Group>

        <Group spacing="xs">
          {user ? (
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
          icon={<IconSearch size={16} />}
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
      {loadingCourses ? (
        <Center mt="xl">
          <Loader />
        </Center>
      ) : error ? (
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
              <CourseCard key={course.id} course={course} user={user} />
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
