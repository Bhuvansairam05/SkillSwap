import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { UserMinus, Trash2 } from "lucide-react";

function Teachers() {
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const token = localStorage.getItem("token");

  // 🔁 Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/teachers",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch teachers");
        }

        setTeachers(data.teachers);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Unable to load teachers");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [token]);

  /* ================= REMOVE FROM TEACHER ================= */

  const handleRemoveTeacher = (userId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-gray-900">
          Remove this user from teacher role?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={() => confirmRemoveTeacher(userId, t.id)}
            className="px-3 py-1.5 rounded-md bg-orange-600 text-white text-sm"
          >
            Remove
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const confirmRemoveTeacher = async (userId, toastId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/removeTeacher/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.message);

      // ✅ remove from teacher table only
      setTeachers(prev => prev.filter(t => t._id !== userId));

      toast.dismiss(toastId);
      toast.success("User removed from teachers ");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || "Failed to remove teacher");
    }
  };

  /* ================= DELETE USER ================= */

  const handleDeleteUser = (userId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-gray-900">
          Permanently delete this user?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={() => confirmDeleteUser(userId, t.id)}
            className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const confirmDeleteUser = async (userId, toastId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/deleteUser/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTeachers(prev => prev.filter(t => t._id !== userId));

      toast.dismiss(toastId);
      toast.success("User deleted successfully ");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || "Failed to delete user");
    }
  };

  if (loading) return <Loader text="Loading Teachers..." />;

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-bold text-gray-900">Teachers</h2>
        <p className="text-sm text-gray-600">All approved teachers</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">USER</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">EMAIL</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">REMOVE</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">DELETE</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {teachers.map(t => (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold">{t.name}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-600">{t.email}</td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleRemoveTeacher(t._id)}
                    className="p-2 rounded-lg hover:bg-orange-100"
                    title="Remove from Teacher"
                  >
                    <UserMinus className="w-5 h-5 text-orange-600" />
                  </button>
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteUser(t._id)}
                    className="p-2 rounded-lg hover:bg-red-100"
                    title="Delete User"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}

            {teachers.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  No teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Teachers;
