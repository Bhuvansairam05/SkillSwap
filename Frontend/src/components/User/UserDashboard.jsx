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


function UserDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const [showTeacherModal, setShowTeacherModal] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

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

  /* =======================
     MOCK TEACHER SESSIONS
     (backend later)
  ======================= */
  const teacherSessions = [
    {
      id: 1,
      learner: "Ravi Kumar",
      skill: "React",
      date: "Feb 10, 2026",
      time: "10:00 AM",
      status: "pending"
    },
    {
      id: 2,
      learner: "Anita Sharma",
      skill: "Node.js",
      date: "Feb 12, 2026",
      time: "2:00 PM",
      status: "approved"
    }
  ];

  /* =======================
     FETCH DASHBOARD DATA
  ======================= */
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

                  {/* 👇 APPLY / APPLIED BUTTON LOGIC */}
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
                    {teacherSessions.map(session => (
                      <div
                        key={session.id}
                        className="border rounded-lg p-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold">{session.skill}</p>
                          <p className="text-sm text-gray-600">
                            {session.learner} • {session.date} • {session.time}
                          </p>
                          <p className="text-xs text-gray-500">
                            Status: {session.status}
                          </p>
                        </div>

                        {session.status !== "completed" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => toast.success("Session approved (mock)")}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => toast.error("Session rejected (mock)")}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}


          {activeTab !== "overview" && (
            <div className="bg-white rounded-xl p-12 text-center">
              <AlertCircle className="mx-auto mb-4 text-gray-400" size={40} />
              <h3 className="text-xl font-bold">Coming Soon</h3>
            </div>
          )}
        </div>
      </main>
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
