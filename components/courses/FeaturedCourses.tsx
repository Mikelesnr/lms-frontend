"use client";

import React, { useState, useEffect } from "react";
import { Divider, SimpleGrid, Text, Loader, Center } from "@mantine/core";
import api, { getCsrfCookie } from "@/lib/api"; // Import api and getCsrfCookie
import { Course } from "@/types"; // Import the Course type
import CourseCard from "@/components/courses/CourseCard"; // Import CourseCard from the same folder

const FeaturedCourses: React.FC = () => {
  const [featured, setFeatured] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        // Get the CSRF cookie before making the request
        await getCsrfCookie();
        const res = await api.get<Course[]>("/api/courses/featured");
        setFeatured(res.data ?? []);
      } catch (err) {
        console.error("Error loading featured courses:", err);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
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
        <Text ta="center" c="dimmed">
          No featured courses right now. Check back soon!
        </Text>
      )}
    </div>
  );
};

export default FeaturedCourses;
