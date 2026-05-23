import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";

// Detailed view for a single issue with actions and activity log.
function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await api.get(`/issues/${id}`);
        setIssue(res.data);
      } catch (err) {
        toast.error("Issue not found");
        navigate("/issues");
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const handleAction = (action) => {
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      if (modalAction === "delete") {
        await api.delete(`/issues/${id}`);
        toast.success("Issue deleted");
        navigate("/issues");
      } else {
        const res = await api.put(`/issues/${id}`, { status: modalAction });
        setIssue(res.data);
        toast.success(`Issue marked as ${modalAction}`);
      }
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setShowModal(false);
    }
  };

  if (loading) return <p className="text-center mt-12 text-slate-400">Loading...</p>;
  if (!issue) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {showModal && (
        <ConfirmModal
          message={
            modalAction === "delete"
              ? "Are you sure you want to delete this issue?"
              : `Mark this issue as "${modalAction}"?`
          }
          onConfirm={confirmAction}
          onCancel={() => setShowModal(false)}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={() => navigate("/issues")}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-md font-semibold cursor-pointer border-none"
        >
          ← Back
        </button>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/issues/${id}/edit`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold cursor-pointer border-none"
          >
            Edit
          </button>
          {issue.status !== "Resolved" && (
            <button
              onClick={() => handleAction("Resolved")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold cursor-pointer border-none"
            >
              Mark Resolved
            </button>
          )}
          {issue.status !== "Closed" && (
            <button
              onClick={() => handleAction("Closed")}
              className="px-4 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded-lg text-sm font-semibold cursor-pointer border-none"
            >
              Close Issue
            </button>
          )}
          <button
            onClick={() => handleAction("delete")}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold cursor-pointer border-none"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h1 className="text-lg font-bold text-slate-800 mb-3">{issue.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <StatusBadge status={issue.status} />
          <StatusBadge priority={issue.priority} />
          <StatusBadge severity={issue.severity} />
        </div>
        <p className="text-slate-600 leading-relaxed mb-4">{issue.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <span>👤 {issue.createdBy?.name}</span>
          <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Activity Log</h2>
        {issue.activityLog?.length === 0 ? (
          <p className="text-slate-400">No activity yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {[...issue.activityLog].reverse().map((entry) => (
              <div key={entry._id} className="flex flex-wrap justify-between items-start bg-slate-50 rounded-lg px-4 py-3 gap-2">
                <span className="text-sm text-slate-700">🔔 {entry.message}</span>
                <span className="text-xs text-slate-400">
                  {entry.by} · {new Date(entry.at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default IssueDetail;