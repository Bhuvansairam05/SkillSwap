import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { Trash2, Plus } from "lucide-react";
import AddSkillModal from "./AddSkillModal";


function Skills() {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH SKILLS ================= */

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/getSkills",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setSkills(data.skills);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Unable to load skills");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [token]);

  /* ================= DELETE SKILL ================= */

  const handleDeleteSkill = (skillId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-gray-900">
          Permanently delete this skill?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={() => confirmDeleteSkill(skillId, t.id)}
            className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const confirmDeleteSkill = async (skillId, toastId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/deleteSkill/${skillId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSkills(prev => prev.filter(s => s._id !== skillId));

      toast.dismiss(toastId);
      toast.success("Skill deleted successfully ");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || "Failed to delete skill");
    }
  };

  if (loading) return <Loader text="Loading Skills..." />;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm">

        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Skills</h2>
            <p className="text-sm text-gray-600">
              All available skills
            </p>
          </div>

          {/* Add Skill Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Skill
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                  SKILL
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                  CATEGORY
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
                  DESCRIPTION
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">
                  DELETE
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {skills.map(skill => (
                <tr key={skill._id} className="hover:bg-gray-50">
                  
                  <td className="px-6 py-4 font-semibold">
                    {skill.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {skill.category}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {skill.description || "—"}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteSkill(skill._id)}
                      className="p-2 rounded-lg hover:bg-red-100"
                      title="Delete Skill"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}

              {skills.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    No skills found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Skill Modal */}
      {showAddModal && (
        <AddSkillModal
          onClose={() => setShowAddModal(false)}
          onSkillAdded={(newSkill) =>
            setSkills(prev => [newSkill, ...prev])
          }
        />
      )}
    </>
  );
}

export default Skills;
