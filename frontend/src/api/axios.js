import axios from "axios";

// Axios instance configured for the backend API.
const api = axios.create({
  baseURL: "https://issue-tracker-api-4kd5.onrender.com/api",
});

// Attach the stored auth token to outgoing requests.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;