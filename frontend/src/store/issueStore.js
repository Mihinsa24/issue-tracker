import { create } from "zustand";
import api from "../api/axios";

// Store for issue list state, counts, and related API actions.
const useIssueStore = create((set) => ({
  issues: [],
  total: 0,
  totalPages: 1,
  currentPage: 1,
  counts: [],
  loading: false,

  fetchIssues: async (params = {}) => {
    set({ loading: true });
    try {
      const res = await api.get("/issues", { params });
      set({
        issues: res.data.issues,
        total: res.data.total,
        totalPages: res.data.totalPages,
        currentPage: res.data.page,
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
    }
  },

  fetchCounts: async () => {
    try {
      const res = await api.get("/issues/counts");
      set({ counts: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  deleteIssue: async (id) => {
    try {
      await api.delete(`/issues/${id}`);
      set((state) => ({
        issues: state.issues.filter((issue) => issue._id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useIssueStore;