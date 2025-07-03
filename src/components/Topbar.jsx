export default function Topbar({ title }) {
  return (
    <header style={{ padding: "1rem", borderBottom: "1px solid #eee" }}>
      <h2>{title || "Instructor Dashboard"}</h2>
    </header>
  );
}
