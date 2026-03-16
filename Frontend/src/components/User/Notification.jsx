import { useEffect, useState } from "react";
import { Bell, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

function Notification({ token, userId }) {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const BASE = "http://localhost:5000/api/user";

                const res = await fetch(
                    `${BASE}/notifications/${userId}`,
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
                `http://localhost:5000/api/user/notifications/${id}/read`,
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
    const deleteNotification = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/user/notifications/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setNotifications(prev =>
                prev.filter(n => n._id !== id)
            );

            toast.success("Notification removed");

        } catch {
            toast.error("Failed to remove notification");
        }
    };
    const clearAllNotifications = async () => {
        try {
            await fetch(`http://localhost:5000/api/user/notifications/clear/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setNotifications([]);

            toast.success("All notifications cleared");

        } catch {
            toast.error("Failed to clear notifications");
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
                                onClick={() => !n.isRead && markAsRead(n._id)}
                                className={`px-4 py-3 text-sm border-b flex justify-between items-start cursor-pointer ${!n.isRead ? "bg-blue-50" : ""}`}
                            >

                                <div>
                                    <p className="text-gray-800 font-semibold">{n.message}</p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();   // prevents triggering markAsRead
                                        deleteNotification(n._id);
                                    }}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                            </div>

                        ))}
                        {notifications.length > 0 && (
                            <div className="flex justify-end p-3 border-t">
                                <button
                                    onClick={clearAllNotifications}
                                    className="text-xs text-red-600 hover:underline"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}

export default Notification;
