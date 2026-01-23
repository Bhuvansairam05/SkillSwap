import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader";
import { Zap } from "lucide-react";
import UsersList from "./UsersList";
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
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) return <Loader text="Loading Admin Dashboard..." />;

  // 🔧 Mock stats (replace later with backend

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
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              {/* Thunder Logo */}
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>

              <span className="font-bold text-gray-900">
                Admin Panel
              </span>
            </div>
          )}

          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { id: "overview", icon: TrendingUp, label: "Overview" },
            { id: "users", icon: Users, label: "Users" },
            { id: "teachers", icon: UserCheck, label: "Teachers" },
            { id: "sessions", icon: Video, label: "Sessions" },
            { id: "credits", icon: Award, label: "Credits" }
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

        <div className="p-4 border-t space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50">
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Settings</span>}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">
              Welcome back, {admin.name}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6 text-gray-600" />
            </button>

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

          {activeTab !== "overview" && activeTab !== "users" && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                {activeTab}
              </h3>
              <p className="text-gray-600">
                This section will be connected to backend soon.
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default Admin;
