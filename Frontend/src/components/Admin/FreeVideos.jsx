import React, { useState } from "react";
import toast from "react-hot-toast";

const SEED_VIDEOS = [
  { id: 1, title: "JavaScript Basics for Beginners", category: "JavaScript", teacher: "Rahul Sharma", duration: "12:34", views: "8.2k", thumb: "https://picsum.photos/seed/js1/400/225" },
  { id: 2, title: "Python Crash Course – Variables & Loops", category: "Python", teacher: "Sneha Patel", duration: "18:05", views: "15k", thumb: "https://picsum.photos/seed/py2/400/225" },
  { id: 3, title: "UI/UX Design Principles Explained", category: "Design", teacher: "Arjun Nair", duration: "22:10", views: "6.5k", thumb: "https://picsum.photos/seed/ux3/400/225" },
  { id: 4, title: "Intro to Pandas & Data Wrangling", category: "Data Science", teacher: "Priya Menon", duration: "28:47", views: "11k", thumb: "https://picsum.photos/seed/ds4/400/225" },
  { id: 5, title: "Async/Await & Promises in JS", category: "JavaScript", teacher: "Rahul Sharma", duration: "14:22", views: "9.8k", thumb: "https://picsum.photos/seed/js5/400/225" },
  { id: 6, title: "Figma for Beginners – Auto Layout", category: "Design", teacher: "Arjun Nair", duration: "19:55", views: "7.1k", thumb: "https://picsum.photos/seed/fig6/400/225" },
];

const CATEGORIES = ["All", "JavaScript", "Python", "Design", "Data Science"];

export default function FreeVideos({ token, userId }) {
  const [tab, setTab] = useState("browse");
  const [videos, setVideos] = useState(SEED_VIDEOS);
  const [activeCat, setActiveCat] = useState("All");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");

  // Upload form state
  const [form, setForm] = useState({
    title: "", category: "", duration: "", thumb: "", description: "",
  });

  const filtered = activeCat === "All" ? videos : videos.filter(v => v.category === activeCat);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFileName(f.name);
    setFileSize((f.size / 1024 / 1024).toFixed(1) + " MB");
  };

  const handleUpload = async () => {
    if (!form.title || !form.category) {
      toast.error("Title and category are required.");
      return;
    }

    // ---------- BACKEND INTEGRATION ----------
    // const formData = new FormData();
    // formData.append("title", form.title);
    // formData.append("category", form.category);
    // formData.append("duration", form.duration);
    // formData.append("description", form.description);
    // formData.append("video", document.getElementById("video-file-input").files[0]);
    //
    // const res = await fetch("http://localhost:5000/api/videos/upload", {
    //   method: "POST",
    //   headers: { Authorization: `Bearer ${token}` },
    //   body: formData,
    // });
    // const data = await res.json();
    // if (!res.ok) { toast.error(data.message); return; }
    // setVideos(prev => [data.video, ...prev]);
    // -----------------------------------------

    // For now, add to local state
    const newVideo = {
      id: Date.now(),
      title: form.title,
      category: form.category,
      duration: form.duration || "--:--",
      thumb: form.thumb || `https://picsum.photos/seed/${Date.now()}/400/225`,
      teacher: "You",
      views: "0 views",
      isNew: true,
    };

    setVideos(prev => [newVideo, ...prev]);
    toast.success("Video uploaded successfully!");
    setForm({ title: "", category: "", duration: "", thumb: "", description: "" });
    setFileName("");
    setFileSize("");
    setTab("browse");
    setActiveCat("All");
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">

      {/* Header + Tab Toggle */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h3 className="text-lg font-bold">Video Resources</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("browse")}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              tab === "browse" ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Browse Videos
          </button>
          <button
            onClick={() => setTab("upload")}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              tab === "upload" ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            + Upload Video
          </button>
        </div>
      </div>

      {/* ── BROWSE TAB ── */}
      {tab === "browse" && (
        <>
          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-1.5 rounded-full text-sm border transition ${
                  activeCat === cat
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Video grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(v => (
              <div key={v.id} className="border rounded-xl overflow-hidden hover:shadow-md transition group">
                <div className="relative">
                  <img
                    src={v.thumb}
                    alt={v.title}
                    className="w-full aspect-video object-cover"
                  />
                  {/* Play overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow">
                      <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[14px] border-transparent border-l-blue-600 ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    {v.duration}
                  </span>
                  {v.isNew && (
                    <span className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                      New
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {v.category}
                  </span>
                  <p className="font-semibold text-sm mt-2 mb-1 leading-snug">{v.title}</p>
                  <p className="text-xs text-gray-500">{v.teacher} · {v.views}</p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-10">No videos in this category yet.</p>
          )}
        </>
      )}

      {/* ── UPLOAD TAB ── */}
      {tab === "upload" && (
        <div className="max-w-xl space-y-5">

          {/* Drag & drop zone */}
          <label
            htmlFor="video-file-input"
            className="flex flex-col items-center gap-2 p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 cursor-pointer hover:border-blue-400 transition"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V4m0 0L8 8m4-4l4 4" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-700">Drag & drop video here</p>
            <p className="text-xs text-gray-500">or <span className="text-blue-600">browse to upload</span></p>
            <p className="text-xs text-gray-400">MP4, MOV, WebM — max 500 MB</p>
            <input
              id="video-file-input"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* File preview */}
          {fileName && (
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="2" width="20" height="20" rx="3" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
              <span className="text-sm text-gray-800 flex-1 truncate">{fileName}</span>
              <span className="text-xs text-gray-500">{fileSize}</span>
            </div>
          )}

          {/* Form fields */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Video title *</label>
            <input
              type="text"
              placeholder="e.g. JavaScript Basics for Beginners"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Select category</option>
                {CATEGORIES.filter(c => c !== "All").map(c => (
                  <option key={c}>{c}</option>
                ))}
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Duration (e.g. 12:34)</label>
              <input
                type="text"
                placeholder="mm:ss"
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Thumbnail URL (optional)</label>
            <input
              type="text"
              placeholder="https://..."
              value={form.thumb}
              onChange={e => setForm({ ...form, thumb: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Description (optional)</label>
            <textarea
              rows={3}
              placeholder="What will learners get from this video?"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setForm({ title: "", category: "", duration: "", thumb: "", description: "" });
                setFileName(""); setFileSize("");
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              onClick={handleUpload}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              Upload Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
}