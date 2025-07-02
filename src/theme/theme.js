import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ef4444", // Tailwind red-500
      dark: "#b91c1c", // Tailwind red-700
    },
    background: {
      default: "#111827", // Tailwind neutral-900
      paper: "#1f2937", // Tailwind neutral-800
    },
    text: {
      primary: "#f9fafb", // Tailwind gray-50
      secondary: "#d1d5db", // Tailwind gray-300
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
});

export default theme;
