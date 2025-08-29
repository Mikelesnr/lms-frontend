// src/types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "instructor" | "student";
  email_verified_at: string | null;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: (redirectPath?: string) => Promise<void>; // Added optional redirectPath
  register: (userData: RegisterData) => Promise<void>;
  fetchUser: () => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: "admin" | "instructor" | "student";
}

// Instructor specific interface, extending User
export interface Instructor extends User {
  courses_count: number; // For InstructorManager
}

// Student specific interface, extending User
export interface Student extends User {
  enrollments_count: number; // For StudentManager
}

// Pagination metadata for Laravel's default pagination
export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  first_page_url: string | null;
  last_page_url: string | null;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

// Quiz related types (moved here for Lesson interface reference)
export interface Answer {
  id: number;
  answer_text: string;
  is_correct: boolean;
}

export interface Question {
  id: number;
  question_text: string;
  quiz_id: number;
  answers: Answer[];
}

// FIXED: Updated Quiz interface to include created_at and updated_at
export interface Quiz {
  id: number;
  lesson_id: number;
  title: string;
  questions: Question[];
  created_at: string;
  updated_at: string;
}

// Removed QuizPreview, as its properties are now consolidated into Quiz

// FIXED: Lesson specific interface with optional quiz, previous_lesson, next_lesson
export interface Lesson {
  id: number;
  title: string;
  grade?: number | null; // User's grade for this lesson's quiz, if completed
  order_number: number;
  course_id: number;
  content: string;
  video_url?: string | null;
  quiz_id?: number | null; // ID of the associated quiz
  quiz?: Quiz | null; // Now directly refers to the comprehensive Quiz interface

  // These are for navigation within a course, assumed to be provided by API
  previous_lesson?: { id: number; title: string; order_number: number } | null;
  next_lesson?: { id: number; title: string; order_number: number } | null;
}

// Course specific interface
export interface Course {
  id: number;
  user_id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  published_at: string | null;
  category: string;
  image_url?: string | null;
  enrolled?: boolean;

  progress?: number;
  next_lesson?: Lesson; // This is a summary for the next lesson in course view, not full object
  instructor?: Instructor;
  lessons?: Lesson[]; // Full lesson objects, used in StudentQuizAnalytics and Course Details
  enrollments_count?: number;
}

export interface QuizAnalyticCourse {
  course_id: number;
  course_title: string;
  lessons: Lesson[];
}

export interface CourseDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  course: Course;
}

// Type for the props of the Benefit component on the Home page
export interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Generic children prop type
export interface ChildrenProps {
  children: React.ReactNode;
}
