import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside
      style={{ width: "200px", padding: "1rem", borderRight: "1px solid #eee" }}
    >
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link to="/instructor/courses">📚 My Courses</Link>
          </li>
          <li>
            <Link to="/instructor/quizzes/1">📝 Quiz Analytics</Link>
          </li>
          <li>
            <Link to="/instructor/students/1">👥 Students</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
