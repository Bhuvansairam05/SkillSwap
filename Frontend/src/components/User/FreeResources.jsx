import React, { useState } from "react";

const ALL_VIDEOS = [
  { id: 1, title: "JavaScript Basics for Beginners", category: "JavaScript", teacher: "Rahul Sharma", duration: "12:34", views: "8.2k", thumb: "https://picsum.photos/seed/js1/400/225" },
  { id: 2, title: "Python Crash Course – Variables & Loops", category: "Python", teacher: "Sneha Patel", duration: "18:05", views: "15k", thumb: "https://picsum.photos/seed/py2/400/225" },
  { id: 3, title: "UI/UX Design Principles Explained", category: "Design", teacher: "Arjun Nair", duration: "22:10", views: "6.5k", thumb: "https://picsum.photos/seed/ux3/400/225" },
  { id: 4, title: "Intro to Pandas & Data Wrangling", category: "Data Science", teacher: "Priya Menon", duration: "28:47", views: "11k", thumb: "https://picsum.photos/seed/ds4/400/225" },
  { id: 5, title: "Async/Await & Promises in JS", category: "JavaScript", teacher: "Rahul Sharma", duration: "14:22", views: "9.8k", thumb: "https://picsum.photos/seed/js5/400/225" },
  { id: 6, title: "Figma for Beginners – Auto Layout", category: "Design", teacher: "Arjun Nair", duration: "19:55", views: "7.1k", thumb: "https://picsum.photos/seed/fig6/400/225" },
];

const CATEGORIES = ["All", "JavaScript", "Python", "Design", "Data Science"];

export default function FreeResources() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? ALL_VIDEOS : ALL_VIDEOS.filter(v => v.category === active);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Free Video Resources</h3>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              active === cat
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
          <div key={v.id} className="border rounded-xl overflow-hidden hover:shadow-md transition">
            <div className="relative">
              <img src={v.thumb} alt={v.title} className="w-full aspect-video object-cover" />
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                {v.duration}
              </span>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition bg-black/20">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
                  <div className="w-0 h-0 border-t-[9px] border-b-[9px] border-l-[16px] border-transparent border-l-blue-600 ml-1" />
                </div>
              </div>
            </div>
            <div className="p-3">
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{v.category}</span>
              <p className="font-semibold text-sm mt-2 leading-snug">{v.title}</p>
              <p className="text-xs text-gray-500 mt-1">{v.teacher} · {v.views} views</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}