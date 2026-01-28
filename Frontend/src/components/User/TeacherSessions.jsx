import { Video, CheckCircle, Link } from "lucide-react";

function TeacherSessions() {
  // 🔴 Mock data (backend later)
  const pendingSessions = [
    {
      id: 1,
      learner: "Ravi Kumar",
      skill: "React",
      date: "Feb 5, 2026",
      time: "10:00 AM",
      duration: "1 hour"
    },
    {
      id: 2,
      learner: "Anita Sharma",
      skill: "Node.js",
      date: "Feb 6, 2026",
      time: "2:00 PM",
      duration: "1 hour"
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-4">Pending Teaching Sessions</h2>

      {pendingSessions.length === 0 ? (
        <p className="text-gray-500 text-sm">No pending sessions</p>
      ) : (
        <div className="space-y-4">
          {pendingSessions.map(session => (
            <div
              key={session.id}
              className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  {session.skill} Session
                </p>
                <p className="text-sm text-gray-600">
                  Learner: {session.learner}
                </p>
                <p className="text-sm text-gray-600">
                  {session.date} • {session.time} • {session.duration}
                </p>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Accept
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">
                  <Link className="w-4 h-4" />
                  Create Zoom Link
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm">
                  <Video className="w-4 h-4" />
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeacherSessions;
