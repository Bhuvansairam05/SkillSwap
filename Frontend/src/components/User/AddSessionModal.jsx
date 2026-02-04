import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Clock, Calendar } from "lucide-react";

const BASE = "http://localhost:5000/api/user";

function AddSessionModal({ userId, token, onClose, onSuccess }) {
    const [skills, setSkills] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const [form, setForm] = useState({
        skillId: "",
        teacherId: "",
        date: "",
        time: "",
        duration: 60
    });

    // 🔹 Get skills that have teachers
    useEffect(() => {
        fetch(`${BASE}/booking/skills`)
            .then(res => res.json())
            .then(data => setSkills(data.skills));
    }, []);

    // 🔹 When skill selected → get teachers
    useEffect(() => {
        if (!form.skillId) return;

        fetch(`${BASE}/booking/teachers/${form.skillId}`)
            .then(res => res.json())
            .then(data => setTeachers(data.teachers));
    }, [form.skillId]);

    const handleBook = async () => {
        if (!form.skillId || !form.teacherId || !form.date || !form.time) {
            return toast.error("Fill all fields");
        }

        const scheduledAt = new Date(`${form.date}T${form.time}`);

        const res = await fetch(`${BASE}/sessions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                skillId: form.skillId,
                teacherId: form.teacherId,
                scheduledAt,
                duration: form.duration,
                learnerId: userId,
                creditsUsed: 5
            })
        });

        const data = await res.json();

        if (res.ok) {
            toast.success("Session booked!");
            onSuccess();
            onClose();
        } else {
            toast.error(data.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-96 space-y-4">
                <h3 className="font-bold text-lg">Book Session</h3>

                {/* Skill */}
                <select
                    onChange={e => setForm({ ...form, skillId: e.target.value })}
                    className="w-full border p-2 rounded"
                >
                    <option value="">Select Skill</option>
                    {skills.map(s => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                </select>

                {/* Teacher */}
                <select
                    onChange={e => setForm({ ...form, teacherId: e.target.value })}
                    className="w-full border p-2 rounded"
                >
                    <option value="">Select Teacher</option>
                    {teachers.map(t => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                </select>

                {/* Date & Time picker */}
                {/* Date */}
                {/* Date with icon */}
                <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        type="date"
                        className="w-full border p-2 pl-10 rounded"
                        onChange={e => setForm({ ...form, date: e.target.value })}
                    />
                </div>

                {/* Time with clock icon */}
                <div className="relative">
                    <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        type="time"
                        className="w-full border p-2 pl-10 rounded"
                        onChange={e => setForm({ ...form, time: e.target.value })}
                    />
                </div>



                {/* Duration */}
                <select
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    className="w-full border p-2 rounded"
                >
                    <option value="30">30 mins</option>
                    <option value="60">60 mins</option>
                    <option value="90">90 mins</option>
                </select>

                <button
                    onClick={handleBook}
                    className="bg-blue-600 text-white w-full py-2 rounded"
                >
                    Book Session
                </button>

                <button onClick={onClose} className="text-red-600 w-full">
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default AddSessionModal;
