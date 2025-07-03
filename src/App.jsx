import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { Container } from "@mui/material";
import InstructorDashboard from "./pages/InstructorDashboard";
import MyCourses from "./pages/MyCourses";
import CourseDetails from "./pages/CourseDetails";
import LessonManager from "./pages/LessonManager";
import StudentList from "./pages/StudentList";
import QuizAnalytics from "./pages/QuizAnalytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <Container maxWidth="sm" sx={{ my: 4 }}>
              <Login />
            </Container>
          }
        />
        <Route
          path="/register"
          element={
            <Container maxWidth="sm" sx={{ my: 4 }}>
              <Register />
            </Container>
          }
        />
        <Route
          path="/dashboard"
          element={
            // <PrivateRoute>
            <Dashboard />
            // </PrivateRoute>
          }
        />
        <Route
          path="/instructor"
          element={
            // <PrivateRoute>
            <InstructorDashboard />
            // </PrivateRoute>
          }
        />
        <Route
          path="/instructor/courses"
          element={
            // <PrivateRoute>
            <MyCourses />
            // </PrivateRoute>
          }
        />
        <Route
          path="/instructor/courses/:id"
          element={
            // <PrivateRoute>
            <CourseDetails />
            // </PrivateRoute>
          }
        />
        <Route
          path="/instructor/lessons/:courseId"
          element={
            // <PrivateRoute>
            <LessonManager />
            // </PrivateRoute>
          }
        />
        <Route
          path="/instructor/students/:courseId"
          element={
            // <PrivateRoute>
            <StudentList />
            // </PrivateRoute>
          }
        />
        <Route
          path="/instructor/quizzes/:courseId"
          element={
            // <PrivateRoute>
            <QuizAnalytics />
            // </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
