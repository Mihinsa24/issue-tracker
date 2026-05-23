import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useIssueStore from "../store/issueStore";
import toast from "react-hot-toast";
import SearchBar from "../components/SearchBar";
import StatusBadge from "../components/StatusBadge";

// Issue listing page with filtering, pagination, and export capability.
function IssueList() {
  const navigate = useNavigate();
  const { issues, loading, totalPages, currentPage, fetchIssues } = useIssueStore();
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIssues({ search, priority, status, page: 1 });
    }, 500);
    return () => clearTimeout(timer);
  }, [search, priority, status]);

  const handlePageChange = (newPage) => {
    fetchIssues({ search, priority, status, page: newPage });
  };

  const exportToCSV = () => {
    const headers = ["Title", "Status", "Priority", "Severity", "Created"];
    const rows = issues.map((issue) => [
      `"${issue.title}"`,
      issue.status,
      issue.priority,
      issue.severity,
      new Date(issue.createdAt).toLocaleDateString(),
    ]);
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "issues.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Issues exported!");
  };

  const statusColors = {
    Open: "bg-blue-100 text-blue-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Resolved: "bg-green-100 text-green-700",
    Closed: "bg-slate-100 text-slate-600",
  };

  const priorityColors = {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-orange-100 text-orange-600",
    High: "bg-red-100 text-red-600",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">All Issues</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={exportToCSV}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm cursor-pointer border-none"
          >
            ⬇ Export CSV
          </button>
          <button
            onClick={() => navigate("/issues/new")}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm cursor-pointer border-none"
          >
            + New Issue
          </button>
        </div>
      </div>

      <SearchBar
        search={search}
        setSearch={setSearch}
        priority={priority}
        setPriority={setPriority}
        status={status}
        setStatus={setStatus}
      />

      {loading ? (
        <p className="text-center text-slate-400 py-12">Loading issues...</p>
      ) : issues.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="mb-4">No issues found.</p>
          <button
            onClick={() => navigate("/issues/new")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold border-none cursor-pointer"
          >
            Create your first issue
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-4 px-6 py-3 bg-slate-50 text-sm font-semibold text-slate-500 uppercase tracking-wide">
            <span className="col-span-2">Title</span>
            <span>Status / Priority</span>
            <span>Created</span>
          </div>
          {issues.map((issue) => (
            <div
              key={issue._id}
              onClick={() => navigate(`/issues/${issue._id}`)}
              className="grid grid-cols-1 md:grid-cols-4 px-6 py-4 border-t border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors gap-2"
            >
              <span className="sm:col-span-2 font-semibold text-slate-800">
                {issue.title}
              </span>
              <div className="flex gap-2 flex-wrap">
                <StatusBadge status={issue.status} />
                <StatusBadge priority={issue.priority} />
              </div>
              <span className="text-sm text-slate-400">
                {new Date(issue.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm cursor-pointer disabled:opacity-50"
          >
            ← Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-lg text-sm cursor-pointer border ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-slate-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm cursor-pointer disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default IssueList;