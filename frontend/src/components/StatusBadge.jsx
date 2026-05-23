// Badge component used for status, priority, and severity labels.
function StatusBadge({ status, priority, severity }) {
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

  const severityColors = {
    Minor: "bg-purple-100 text-purple-700",
    Major: "bg-pink-100 text-pink-700",
    Critical: "bg-red-200 text-red-800",
  };

  const label = status || priority || severity;
  const color = status
    ? statusColors[status]
    : priority
    ? priorityColors[priority]
    : severityColors[severity];

  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${color}`}>
      {label}
    </span>
  );
}

export default StatusBadge;