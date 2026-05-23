import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function IssueCard({ issue }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/issues/${issue._id}`)}
      className="bg-white rounded-xl px-5 py-4 shadow-sm flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div>
        <p className="font-semibold text-slate-800">{issue.title}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          {new Date(issue.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex gap-2">
        <StatusBadge status={issue.status} />
        <StatusBadge priority={issue.priority} />
      </div>
    </div>
  );
}

export default IssueCard;