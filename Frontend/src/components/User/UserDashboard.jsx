import React, { useState, useEffect } from "react";
import {
  Zap,
  BookOpen,
  Video,
  Award,
  Clock,
  Star,
  TrendingUp,
  Bell,
  LogOut,
  Menu,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Loader from "../Loader";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TeacherApplicationModal from "./TeacherApplicationModal";
import AddSessionModal from "./AddSessionModal";


function UserDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const BASE = "http://localhost:5000/api/user";

  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [sessions, setSessions] = useState([]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [teacherSessions, setTeacherSessions] = useState([]);
  const [zoomLinks, setZoomLinks] = useState({});



  // ✅ user state
  const [user, setUser] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || "",
    isTeacher: storedUser?.isTeacher || false,
    role: storedUser?.role || "user",
    credits: storedUser?.credits || 0,
    completedSessions: 0,
    totalHours: 0,
    rating: 0
  });
  useEffect(() => {
  if (user.isTeacher) {
    fetch(`http://localhost:5000/api/user/teacher/sessions/${userId}`)
      .then(res => res.json())
      .then(data => setTeacherSessions(data.sessions));
  }
}, [activeTab, user.isTeacher]);

  useEffect(() => {
    const fetchAllSkills = async () => {
      const res = await fetch(`${BASE}/all-skills`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAllSkills(data.skills);
    };

    fetchAllSkills();
  }, []);
  useEffect(() => {
    const fetchUserSkills = async () => {
      const res = await fetch(`${BASE}/skills/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setSkillsLearning(data.user.skillsLearning || []);
      setSkillsTeaching(data.user.skillsTeaching || []);
    };

    if (userId) fetchUserSkills();
  }, [userId]);
  const handleAddLearningSkill = async () => {
    if (!selectedSkill) return;

    const res = await fetch(`${BASE}/skills/learning/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ skillId: selectedSkill })
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      setSelectedSkill("");
      // refresh skills
      const updated = await fetch(`${BASE}/skills/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const udata = await updated.json();
      setSkillsLearning(udata.user.skillsLearning);
    } else {
      toast.error(data.message);
    }
  };
  useEffect(() => {
    if (activeTab === "sessions") {
      fetch(`http://localhost:5000/api/user/sessions/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setSessions(data.sessions));
    }
  }, [activeTab]);
  const handleApproveSession = async (id, link) => {
    await fetch(
      `http://localhost:5000/api/user/teacher/sessions/approve/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingLink: link })
      }
    );

    toast.success("Session approved");
    setTeacherSessions(prev =>
      prev.map(s =>
        s._id === id ? { ...s, meetingLink: link } : s
      )
    );
  };

  const handleComplete = async (id) => {
    await fetch(`http://localhost:5000/api/user/sessions/complete/${id}`, {
      method: "PUT"
    });
    toast.success("Session completed");
    setSessions(prev =>
      prev.map(s => (s._id === id ? { ...s, status: "completed" } : s))
    );
  };

  const handleCancel = async (id) => {
    await fetch(`http://localhost:5000/api/user/sessions/cancel/${id}`, {
      method: "PUT"
    });
    toast.error("Session cancelled");
    setSessions(prev =>
      prev.map(s => (s._id === id ? { ...s, status: "cancelled" } : s))
    );
  };

  useEffect(() => {
    if (user.skillsLearning) setSkillsLearning(user.skillsLearning);
    if (user.skillsTeaching) setSkillsTeaching(user.skillsTeaching);
  }, [user]);



  const handleAddTeachingSkill = async () => {
    if (!selectedSkill) return;

    const res = await fetch(`${BASE}/skills/teaching/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ skillId: selectedSkill })
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      setSelectedSkill("");
      const updated = await fetch(`${BASE}/skills/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const udata = await updated.json();
      setSkillsTeaching(udata.user.skillsTeaching);
    } else {
      toast.error(data.message);
    }
  };

  const handleDeleteLearning = async (skillId) => {
    await fetch(`${BASE}/skills/learning/${userId}/${skillId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    setSkillsLearning(prev =>
      prev.filter(item => item.skill._id !== skillId)
    );
  };

  const handleDeleteTeaching = async (skillId) => {
    await fetch(`${BASE}/skills/teaching/${userId}/${skillId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    setSkillsTeaching(prev =>
      prev.filter(item => item.skill._id !== skillId)
    );
  };


  /* =======================
     MOCK TEACHER SESSIONS
     (backend later)
  ======================= */

  const [skillsLearning, setSkillsLearning] = useState(user.skillsLearning || []);
  const [skillsTeaching, setSkillsTeaching] = useState(user.skillsTeaching || []);



  /* =======================
     FETCH DASHBOARD DATA
  ======================= */

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:5000/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      setUser(prev => ({
        ...prev,
        ...data.user
      }));

      // also update localStorage so next refresh is correct
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.isTeacher) {
        localStorage.removeItem("teacherApplied");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/api/user/dashboardData/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch dashboard data");
        }

        setUser(prev => ({
          ...prev,
          credits: data.data.credits,
          completedSessions: data.data.completedSessions,
          totalHours: data.data.totalHours,
          rating: data.data.rating
        }));
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) fetchDashboardData();
  }, [userId, token]);

  /* =======================
     LOGOUT
  ======================= */
  const confirmLogout = (toastId) => {
    toast.dismiss(toastId);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.clear();
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/"), 1000);
  };

  const handleLogout = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-gray-900">
            Are you sure you want to logout?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => confirmLogout(t.id)}
              className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        <div>
          <p className="text-gray-600 text-xs sm:text-sm">{title}</p>
          <p className="text-xl sm:text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r transition-all hidden md:flex md:flex-col`}>
        <div className="h-16 sm:h-20 lg:h-24 px-4 border-b flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="font-bold text-gray-900">Peer Skill</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className="p-4 space-y-3 mt-2">
          {[
            { id: "overview", icon: TrendingUp, label: "Dashboard" },
            { id: "Skills", icon: BookOpen, label: "My Skills" },
            { id: "sessions", icon: Video, label: "Sessions" }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === item.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b h-24 px-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">Welcome back, {user.name}</h1>
            <p className="text-sm text-gray-600">Learner Dashboard</p>
          </div>

          <div className="flex items-center gap-6">
            <Bell className="w-6 h-6 text-gray-600" />
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-gray-600">{user.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </header>

        <div className="p-6">
          {activeTab === "overview" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={Award} title="Credits" value={user.credits} color="bg-blue-600" />
                <StatCard icon={CheckCircle} title="Completed Sessions" value={user.completedSessions} color="bg-green-600" />
                <StatCard icon={Clock} title="Total Hours" value={user.totalHours} color="bg-orange-600" />
                <StatCard icon={Star} title="Rating" value={user.rating} color="bg-purple-600" />
              </div>

              {/* CONDITIONAL BLOCK */}
              {!user.isTeacher ? (
                <div className="bg-blue-600 text-white rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2">Become a Teacher</h3>
                  <p className="text-sm mb-4">
                    Share your knowledge, conduct live sessions, and earn credits.
                  </p>

                  {localStorage.getItem("teacherApplied") === "true" ? (
                    <button
                      disabled
                      className="bg-black text-white px-5 py-2 rounded-lg font-semibold text-sm cursor-not-allowed"
                    >
                      Applied
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowTeacherModal(true)}
                      className="bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold text-sm"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Your Teaching Sessions</h3>

                  <div className="space-y-4">
                    {teacherSessions.length === 0 && (
                      <p className="text-gray-500">No sessions booked yet.</p>
                    )}

                    {teacherSessions.map((session) => (
                      <div
                        key={session._id}
                        className="border rounded-lg p-4 flex flex-col gap-3"
                      >
                        <div>
                          <p className="font-semibold text-lg">
                            {session.skill.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Learner: {session.learner.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(session.scheduledAt).toLocaleString()} •{" "}
                            {session.duration} mins
                          </p>
                        </div>

                        {/* If link not added yet */}
                        {!session.meetingLink ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Paste Zoom link here"
                              className="border px-3 py-2 rounded-md flex-1"
                              value={zoomLinks[session._id] || ""}
                              onChange={(e) =>
                                setZoomLinks({
                                  ...zoomLinks,
                                  [session._id]: e.target.value
                                })
                              }
                            />
                            <button
                              onClick={() => handleApproveSession(session._id,zoomLinks[session._id])}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                            >
                              Approve
                            </button>
                          </div>
                        ) : (
                          <a
                            href={session.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline text-sm"
                          >
                            Join Meeting
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </>
          )}

          {activeTab === "Skills" && (
            <div className="space-y-8">
              {/* Add Skill Input */}
              <div className="bg-white p-6 rounded-xl shadow-sm flex gap-4">
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="flex-1 border px-4 py-2 rounded-lg"
                >
                  <option value="">Select a skill</option>
                  {allSkills.map(skill => (
                    <option key={skill._id} value={skill._id}>
                      {skill.name} ({skill.category})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAddLearningSkill}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Add Learning
                </button>
                <button
                  onClick={handleAddTeachingSkill}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Add Teaching
                </button>
              </div>

              {/* Skills Learning */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">📘 Skills I'm Learning</h3>

                {skillsLearning.length === 0 && (
                  <p className="text-gray-500">No learning skills added yet.</p>
                )}

                <div className="space-y-4">
                  {skillsLearning.map((item, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <p className="font-semibold">{item.skill.name}</p>
                        <button
                          onClick={() => handleDeleteLearning(item.skill._id)}

                          className="text-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 h-3 rounded-full">
                        <div
                          className="bg-blue-600 h-3 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Progress: {item.progress}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Teaching */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">🎓 Skills I'm Teaching</h3>

                {skillsTeaching.length === 0 && (
                  <p className="text-gray-500">No teaching skills added yet.</p>
                )}

                <div className="space-y-4">
                  {skillsTeaching.map((item, index) => (
                    <div key={index} className="border p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{item.skill.name}</p>
                        <p className={`text-xs mt-1 ${item.approved ? "text-green-600" : "text-yellow-600"}`}>
                          {item.approved ? "Approved to teach" : "Waiting for approval"}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteTeaching(item.skill._id)}

                        className="text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "sessions" && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">My Sessions</h3>
                <button
                  onClick={() => setShowSessionModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  + Add Session
                </button>
              </div>

              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border">Skill</th>
                    <th className="p-3 border">Teacher</th>
                    <th className="p-3 border">Date</th>
                    <th className="p-3 border">Duration</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Meeting</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(s => (
                    <tr key={s._id} className="text-center border">
                      <td className="p-2 border">{s.skill.name}</td>
                      <td className="p-2 border">{s.teacher.name}</td>
                      <td className="p-2 border">
                        {new Date(s.scheduledAt).toLocaleString()}
                      </td>
                      <td className="p-2 border">{s.duration} mins</td>
                      <td className="p-2 border">{s.status}</td>
                      <td className="p-2 border">
                        {s.meetingLink ? (
                          <a
                            href={s.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            Join
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
      {showSessionModal && (
        <AddSessionModal
          userId={userId}
          token={token}
          onClose={() => setShowSessionModal(false)}
          onSuccess={() => window.location.reload()}
        />
      )}

      {showTeacherModal && (
        <TeacherApplicationModal
          user={storedUser}
          onClose={() => setShowTeacherModal(false)}
        />
      )}

    </div>
  );
}

export default UserDashboard;
