import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { X } from "lucide-react";

function AddSkillModal({ onClose, onSkillAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      toast.error("Skill name and category are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/admin/addSkill",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Skill added successfully ");
      onSkillAdded(data.skill); // 🔁 update table instantly
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-semibold">Add Skill</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium">Skill Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              placeholder="e.g. React"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              placeholder="e.g. Frontend"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              placeholder="Optional description"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              {loading ? "Adding..." : "Add Skill"}
            </button>
          </div>
        </form>

        {loading && <Loader />}
      </div>
    </div>
  );
}

export default AddSkillModal;
