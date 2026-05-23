import { create } from "zustand";

// Load persisted authentication state from localStorage.
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    return null;
  }
};

const getStoredToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (err) {
    return null;
  }
};

// Global auth store for user session and token management.
const useAuthStore = create((set) => ({
  user: getStoredUser() || null,
  token: getStoredToken() || null,

  login: (user, token) => {
    try {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (err) {
      // ignore storage failures in test or unsupported environments
    }
    set({ user, token });
  },

  logout: () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (err) {
      // ignore storage failures in test or unsupported environments
    }
    set({ user: null, token: null });
  },
}));

export default useAuthStore;