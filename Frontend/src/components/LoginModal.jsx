import React, { useState } from "react";
import toast from "react-hot-toast"
export default function LoginModal({ onClose, openSignup }) {
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

      // Save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login successful 🎉");
      setLoading(false);
      onClose(); // close modal

      // later → redirect to dashboard
      console.log("Login success:", data);

    } catch (err) {
      toast.error("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
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
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />

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
  );
}
