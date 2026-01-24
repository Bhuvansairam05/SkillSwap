import { useEffect, useState } from "react";
import { Eye, Video, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../Loader";

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const token = localStorage.getItem("token");

  /* ================= FETCH SESSIONS ================= */

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/sessions",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch sessions");
        }

        setSessions(data.sessions);
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Unable to load sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [token]);

  /* ================= CANCEL SESSION ================= */

  const handleCancelSession = (sessionId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-gray-900">
          Cancel this session?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 text-sm"
          >
            No
          </button>

          <button
            onClick={() => confirmCancelSession(sessionId, t.id)}
            className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm"
          >
            Cancel Session
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const confirmCancelSession = async (sessionId, toastId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/sessions/${sessionId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ Update UI instantly
      setSessions(prev =>
        prev.map(s =>
          s._id === sessionId ? { ...s, status: "cancelled" } : s
        )
      );

      toast.dismiss(toastId);
      toast.success("Session cancelled successfully ");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || "Failed to cancel session");
    }
  };

  /* ================= FILTER LOGIC ================= */

  const filteredSessions =
    statusFilter === "all"
      ? sessions
      : sessions.filter(s => s.status === statusFilter);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });

  if (loading) return <Loader text="Loading Sessions..." />;

  return (
    <div className="bg-white rounded-xl shadow-sm">

      {/* Header */}
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Sessions</h2>
          <p className="text-sm text-gray-600">
            All learning sessions
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
        >
          <option value="all">All</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">LEARNER</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">TEACHER</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">SKILL</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">SCHEDULED</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">STATUS</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">CREDITS</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">ACTION</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredSessions.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{s.learner?.name}</td>
                <td className="px-6 py-4">{s.teacher?.name}</td>
                <td className="px-6 py-4">{s.skill?.name}</td>
                <td className="px-6 py-4 text-gray-600">
                  {formatDate(s.scheduledAt)}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full
                      ${
                        s.status === "scheduled"
                          ? "bg-blue-100 text-blue-600"
                          : s.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                  >
                    {s.status}
                  </span>
                </td>

                <td className="px-6 py-4">{s.creditsUsed}</td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    {s.meetingLink && s.status === "scheduled" && (
                      <a
                        href={s.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg hover:bg-blue-100"
                      >
                        <Video className="w-5 h-5 text-blue-600" />
                      </a>
                    )}

                    <button
                      onClick={() => toast("View session coming soon")}
                      className="p-2 rounded-lg hover:bg-gray-200"
                    >
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>

                    {s.status === "scheduled" && (
                      <button
                        onClick={() => handleCancelSession(s._id)}
                        className="p-2 rounded-lg hover:bg-red-100"
                      >
                        <XCircle className="w-5 h-5 text-red-600" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredSessions.length === 0 && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No sessions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sessions;
