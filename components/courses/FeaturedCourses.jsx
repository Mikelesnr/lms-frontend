"use client";

import { useState, useEffect } from "react";
import { Divider, SimpleGrid, Text, Loader, Center } from "@mantine/core";
import CourseCard from "./CourseCard";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function FeaturedCourses() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuthStore();

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await api.get("/api/courses/featured", { headers });
        setFeatured(res.data ?? []);
      } catch (err) {
        console.error("Error loading featured courses:", err);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [token]);

  return (
    <div style={{ marginTop: "3rem" }}>
      <Divider label="🔥 Featured Courses" labelPosition="center" my="xl" />

      {loading ? (
        <Center>
          <Loader />
        </Center>
      ) : featured.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {featured.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </SimpleGrid>
      ) : (
        <Text align="center" c="dimmed">
          No featured courses right now. Check back soon!
        </Text>
      )}
    </div>
  );
}
