import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { Trash2 } from "lucide-react";


function UsersList() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const handleDeleteUser = (userId) => {
  toast((t) => (
    <div className="flex flex-col gap-3">
      <p className="font-semibold text-gray-900">
        Are you sure you want to delete this user?
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 text-sm font-medium"
        >
          Cancel
        </button>

        <button
          onClick={() => confirmDeleteUser(userId, t.id)}
          className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  ), {
    duration: Infinity
  });
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

    if (!res.ok) {
      throw new Error(data.message || "Failed to delete user");
    }

    // ✅ Update UI
    setUsers(prev =>
      prev.filter(user => user._id !== userId)
    );

    toast.dismiss(toastId);
    toast.success("User deleted successfully 🗑️");

  } catch (error) {
    console.error(error);
    toast.dismiss(toastId);
    toast.error(error.message || "Error deleting user");
  }
};


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }

        setUsers(data.users); // 👈 backend aligned
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Unable to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  if (loading) return <Loader text="Loading Users..." />;

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-bold text-gray-900">Users</h2>
        <p className="text-sm text-gray-600">All registered users</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Credits
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Delete
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr
                key={user._id}
                className="group hover:bg-gray-50 transition"
              >
                {/* User */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {user._id.slice(-6)}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-gray-600">
                  {user.email}
                </td>

                {/* Credits */}
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                    {user.credits} credits
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="p-2 rounded-lg hover:bg-red-100 transition"
                    title="Delete User"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </td>

              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersList;
