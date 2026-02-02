import { X, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function TeacherApplicationModal({ onClose, user }) {
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!skills.trim()) {
    toast.error("Please enter at least one skill");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      type: "NEW_TEACHER",
      message: `${user.name} applied to become a teacher`,
      skills: skills.split(",").map(s => s.trim()),
      userId: user.id
    };

    const res = await fetch(
      "http://localhost:5000/api/admin/addNotification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    toast.success("Application sent to admin");

    // ✅ store flag in localStorage
    localStorage.setItem("teacherApplied", "true");

    onClose();
    window.location.reload(); // refresh dashboard state
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Apply to Become a Teacher
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Enter the skills you want to teach. Admin will review and approve your request.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Skills input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              placeholder="React, Node.js, Java, Python"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm flex items-center gap-2 disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeacherApplicationModal;