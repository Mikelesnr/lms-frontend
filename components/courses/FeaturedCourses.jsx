"use client";

import { useState, useEffect } from "react";
import {
  Divider,
  SimpleGrid,
  Text,
  Loader,
  Title,
  Center,
} from "@mantine/core";
import CourseCard from "./CourseCard";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function FeaturedCourses() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sanctumGet } = useSanctumRequest();

  useEffect(() => {
    sanctumGet("/api/courses/featured")
      .then((res) => setFeatured(res.data))
      .catch((err) => {
        console.error("Error loading featured courses:", err);
        setFeatured([]);
      })
      .finally(() => setLoading(false));
  }, []);

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
