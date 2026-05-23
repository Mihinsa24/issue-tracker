import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useIssueStore from "../store/issueStore";
import toast from "react-hot-toast";
import IssueCard from "../components/IssueCard";

// Dashboard page shows summary counts and recent issues.
function Dashboard() {
  const { counts, fetchCounts, fetchIssues, issues, loading } = useIssueStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCounts();
    fetchIssues({ limit: 5 });
  }, []);

  const getCount = (status) => {
    const found = counts.find((c) => c._id === status);
    return found ? found.count : 0;
  };

  const stats = [
    { label: "Open", value: getCount("Open"), color: "text-blue-600", bg: "bg-blue-100" },
    { label: "In Progress", value: getCount("In Progress"), color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Resolved", value: getCount("Resolved"), color: "text-green-700", bg: "bg-green-100" },
    { label: "Closed", value: getCount("Closed"), color: "text-slate-600", bg: "bg-gray-200" },
  ];

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-row flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        <div className="flex gap-2">
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-5 text-center`}>
            <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className={`text-sm font-semibold mt-1 ${stat.color}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Issues</h2>
      {loading ? (
        <p className="text-slate-400 text-center py-8">Loading...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;