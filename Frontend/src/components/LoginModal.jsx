import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { Eye, EyeOff } from "lucide-react";
export default function LoginModal({ onClose, openSignup }) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Login failed");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login successful");
      console.log("Login success:", data);
      setLoading(false);
      onClose(); // close modal
      if (data.user.role == "admin") {
        navigate("/admin", { state: { user: data.user } });
      }
      else if (data.user.isTeacher) {
        navigate("/teacher", { state: { user: data.user } });
      }
      else {
        navigate("/user", { state: { user: data.user } });
      }
      console.log("Login success:", data);
    } catch (err) {
      toast.error("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader text="Logging in..." />}
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-md rounded-xl shadow-md p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login</h2>

          {error && (
            <p className="text-red-600 text-sm mb-3">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Cancel
            </button>

            <button
              onClick={openSignup}
              className="text-blue-600 font-semibold text-sm hover:underline"
            >
              Don’t have an account? Sign up
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
