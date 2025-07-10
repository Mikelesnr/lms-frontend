import axios from "axios";
import Cookies from "js-cookie";

const xsrfToken = Cookies.get("XSRF-TOKEN");
const sessionToken = Cookies.get("lms_learning_system_session");

const api = axios.create({
  baseURL: "https://lms-frontend-6qso.onrender.com",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    ...(xsrfToken && { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) }),
    ...(sessionToken && {
      Cookie: `lms_learning_system_session=${sessionToken}`,
    }), // optional; not always required
  },
});

export default api;
