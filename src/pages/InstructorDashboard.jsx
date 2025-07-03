import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardStats from "../components/DashboardStats";

export default function InstructorDashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <Topbar title="Instructor Dashboard" />
        <DashboardStats />
        {/* Future: list recent quizzes, student activity, alerts */}
      </main>
    </div>
  );
}
