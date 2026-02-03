import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader";
import { Zap } from "lucide-react";
import UsersList from "./UsersList";
import Teachers from "./Teachers";
import Sessions from "./Sessions";
import Skills from "./Skills";
import Notification from "./Notification";
import {
  Users,
  Video,
  Award,
  TrendingUp,
  AlertCircle,
  UserCheck,
  Bell,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";

function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const token = localStorage.getItem("token");
  const [dashboardStats, setDashboardStats] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 🔐 Get admin from navigation or storage
  useEffect(() => {
    if (location.state?.user) {
      setAdmin(location.state.user);
      setLoading(false);
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
      setLoading(false);
      return;
    }

    toast.error("Unauthorized access");
    navigate("/");
  }, [location, navigate]);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/dashboardData",
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

        setDashboardStats(data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard stats");
      }
    };

    fetchDashboardData();
  }, [token, activeTab]);
  const confirmLogout = (toastId) => {
    toast.dismiss(toastId);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.clear();
    toast.success("Logged out successfully ");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-gray-900">
          Are you sure you want to logout?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 text-sm font-medium"
          >
            Cancel
          </button>

          <button
            onClick={() => confirmLogout(t.id)}
            className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    ), {
      duration: Infinity
    });
  };
  if (loading) return <Loader text="Loading Admin Dashboard..." />;
  const StatCard = ({ icon: Icon, title, value, trend, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r transition-all`}>
        <div className="h-24 px-4 border-b flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              {/* Thunder Logo */}
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>

              <span className="font-bold text-gray-900">
                Peer Skill
              </span>
            </div>
          )}

          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className="p-4 space-y-3 mt-2">
          {[
            { id: "overview", icon: TrendingUp, label: "Overview" },
            { id: "users", icon: Users, label: "Users" },
            { id: "teachers", icon: UserCheck, label: "Teachers" },
            { id: "sessions", icon: Video, label: "Sessions" },
            { id: "skills", icon: Award, label: "Skills" }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === item.id
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b h-24 px-8 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">
              Welcome back, {admin.name}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Notification
              token={token}
              onOpenTeachers={() => setActiveTab("teachers")}
            />


            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {admin.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {admin.name}
                </p>
                <p className="text-xs text-gray-600">{admin.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </header>

        {/* Dashboard */}
        <div className="p-8">
          {activeTab === "overview" && dashboardStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                title="Total Users"
                value={dashboardStats.users}
                color="bg-blue-600"
              />

              <StatCard
                icon={Video}
                title="Total Sessions"
                value={dashboardStats.sessions}
                color="bg-green-600"
              />

              <StatCard
                icon={Award}
                title="Total Skills"
                value={dashboardStats.skills}
                color="bg-orange-600"
              />

              <StatCard
                icon={UserCheck}
                title="Teachers"
                value={dashboardStats.teachers}
                color="bg-purple-600"
              />
            </div>
          )}


          {activeTab === "users" && (
            <UsersList token={token} />
          )}

          {activeTab === "teachers" && (
            <Teachers />
          )}
          {activeTab === "sessions" && (
            <Sessions />
          )}
          {activeTab === "skills" && (
            <Skills />
          )}
        </div>

      </main>
    </div>
  );
}

export default Admin;
