"use client";

import { useEffect, useState } from "react";
import { NavLink, Loader, Alert } from "@mantine/core";
import {
  IconHome,
  IconBook,
  IconChartBar,
  IconAlertCircle,
} from "@tabler/icons-react";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import StudentOverviewCards from "@/components/student/OverviewCards";
import EnrolledCoursesTable from "@/components/student/EnrolledCoursesTable";
import StudentQuizAnalytics from "@/components/student/QuizAnalytics";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";
import RequireAuth from "@/components/auth/RequireAuth";

export default function StudentDashboard() {
  const [view, setView] = useState("overview");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const { sanctumGet } = useSanctumRequest();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await sanctumGet("/api/enrollments/me");
        setCourses(res.data || []);
        setLoadError(null);
      } catch (err) {
        console.error("❌ Error fetching enrollments:", err);
        setCourses([]);
        setLoadError("Could not load your enrolled courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [sanctumGet]); // ✅ Stable dependency

  const navbar = (
    <>
      <NavLink
        label="🏠 Overview"
        icon={<IconHome size="1rem" />}
        active={view === "overview"}
        onClick={() => setView("overview")}
      />
      <NavLink
        label="📘 Enrollments"
        icon={<IconBook size="1rem" />}
        active={view === "courses"}
        onClick={() => setView("courses")}
      />
      <NavLink
        label="📊 Quiz Results"
        icon={<IconChartBar size="1rem" />}
        active={view === "analytics"}
        onClick={() => setView("analytics")}
      />
    </>
  );

  const renderContent = () => {
    if (loading) return <Loader mt="xl" />;
    if (loadError)
      return (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Fetch error"
          color="red"
          mt="md"
        >
          {loadError}
        </Alert>
      );

    if (view === "overview") return <StudentOverviewCards courses={courses} />;
    if (view === "courses") return <EnrolledCoursesTable courses={courses} />;
    if (view === "analytics") return <StudentQuizAnalytics courses={courses} />;
    return null;
  };

  return (
    <RequireAuth role="student">
      <DashboardLayout title="Student Dashboard" navbar={navbar}>
        {renderContent()}
      </DashboardLayout>
    </RequireAuth>
  );
}
