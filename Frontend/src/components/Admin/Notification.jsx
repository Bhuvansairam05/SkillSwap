import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import toast from "react-hot-toast";

function Notification({ token, onOpenTeachers }) {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch(
                    "http://localhost:5000/api/admin/getNotifications",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();
                if (!res.ok) throw new Error();

                setNotifications(data.notifications);
            } catch (err) {
                toast.error("Failed to load notifications");
            }
        };

        fetchNotifications();
    }, [token]);

    const markAsRead = async (id) => {
        try {
            await fetch(
                `http://localhost:5000/api/admin/notifications/${id}/read`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setNotifications(prev =>
                prev.map(n =>
                    n._id === id ? { ...n, isRead: true } : n
                )
            );
        } catch {
            toast.error("Failed to update notification");
        }
    };

    return (
        <div className="relative">
            {/* Bell */}
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
                <Bell className="w-6 h-6 text-gray-600" />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg z-50">
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                        <span className="font-semibold text-gray-800">
                            Notifications
                        </span>

                        <button
                            onClick={() => setOpen(false)}
                            className="p-1 rounded hover:bg-gray-100"
                        >
                            <X className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>


                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 && (
                            <p className="p-4 text-sm text-gray-500">
                                No notifications
                            </p>
                        )}

                        {notifications.map(n => (
                            <div
                                key={n._id}
                                className={`px-4 py-3 text-sm border-b ${!n.isRead ? "bg-blue-50" : ""}`}
                            >
                                <p className="text-gray-800 font-semibold">{n.message}</p>

                                {/* Skills */}
                                {n.skills && (
                                    <p className="text-xs text-gray-600 mt-1">
                                        Skills: {n.skills.join(", ")}
                                    </p>
                                )}

                                {/* Zoom link input if not added */}
                                {!n.zoomlink && !n.approve && !n.reject && (
                                    <div className="mt-2 flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Paste Zoom link"
                                            className="border px-2 py-1 rounded w-full text-xs"
                                            onBlur={async (e) => {
                                                const link = e.target.value;
                                                if (!link) return;

                                                await fetch(
                                                    `http://localhost:5000/api/admin/notifications/${n._id}/zoom`,
                                                    {
                                                        method: "PATCH",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                            Authorization: `Bearer ${token}`
                                                        },
                                                        body: JSON.stringify({ zoomlink: link })
                                                    }
                                                );

                                                toast.success("Zoom link sent to user");
                                            }}
                                        />
                                    </div>
                                )}

                                {/* After zoom added → show Approve Reject */}
                                {n.zoomlink && !n.approve && !n.reject && (
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={async () => {
                                                await fetch(
                                                    `http://localhost:5000/api/admin/notifications/${n._id}/approve`,
                                                    {
                                                        method: "PATCH",
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    }
                                                );
                                                toast.success("Teacher Approved");
                                                window.location.reload();
                                            }}
                                            className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={async () => {
                                                await fetch(
                                                    `http://localhost:5000/api/admin/notifications/${n._id}/reject`,
                                                    {
                                                        method: "PATCH",
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    }
                                                );
                                                toast.error("Teacher Rejected");
                                                window.location.reload();
                                            }}
                                            className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}

                                {/* Status */}
                                {n.approve && (
                                    <p className="text-green-600 text-xs mt-2 font-semibold">
                                        Approved ✅
                                    </p>
                                )}

                                {n.reject && (
                                    <p className="text-red-600 text-xs mt-2 font-semibold">
                                        Rejected ❌
                                    </p>
                                )}

                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(n.createdAt).toLocaleString()}
                                </p>
                            </div>

                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notification;
