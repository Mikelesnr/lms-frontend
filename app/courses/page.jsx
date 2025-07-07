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
} from "@mantine/core";
import { IconSearch, IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks"; // ✅ Debounce hook
import api from "@/lib/api";
import CourseCard from "@/components/courses/CourseCard";

export default function AllCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300); // ✅ Debounce search
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  // ✅ Load categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/courses/categories");
        setCategoryOptions(res.data || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Load courses when filters or debounced search changes
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = await api.get("/api/courses/all", {
          params: { search: debouncedSearch, category, page },
        });

        setCourses(res.data.data || []);

        const lastPage = res.data?.meta?.last_page ?? res.data?.last_page;
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
  }, [debouncedSearch, category, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container my="lg">
      <Title order={2} mb="md">
        📚 All Courses
      </Title>

      {/* Filters */}
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

      {/* Results */}
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
