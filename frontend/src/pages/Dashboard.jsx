import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../App";
import { TEMPLATES, COMPANIES } from "../constants/companies";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(true);

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await axios.get("/api/resume");
      setResumes(data.resumes || []);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  const createNew = async () => {
    try {
      const { data } = await axios.post("/api/resume", { title: "New Resume" });
      navigate(`/builder/${data.resume._id}`);
    } catch (err) {
      alert("Failed to create resume. Please try again.");
    }
  };

  const deleteResume = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this resume?")) return;
    try {
      await axios.delete(`/api/resume/${id}`);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch { alert("Delete failed."); }
  };

  const duplicateResume = async (id, e) => {
    e.stopPropagation();
    try {
      const { data } = await axios.post(`/api/resume/${id}/duplicate`);
      setResumes((prev) => [data.resume, ...prev]);
    } catch { alert("Duplicate failed."); }
  };

  const scoreColor = (s) =>
    s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : s >= 40 ? "#f97316" : "#ef4444";

  const bg = dark ? "bg-[#09090f]" : "bg-slate-100";
  const card = dark ? "bg-[#0f0f1a] border-slate-800" : "bg-white border-slate-200";
  const text = dark ? "text-white" : "text-slate-900";
  const sub = dark ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`min-h-screen ${bg} ${text} transition-colors`}>
      {/* Header */}
      <header className={`border-b ${dark ? "border-slate-800 bg-[#0a0a14]" : "border-slate-200 bg-white"} px-6 py-4`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-indigo-500 text-xl">✦</span>
            <span className="font-bold text-lg">SmartCV</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-lg ${dark ? "hover:bg-slate-800" : "hover:bg-slate-100"} transition-colors text-lg`}
            >
              {dark ? "☀️" : "🌙"}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className={`text-sm hidden sm:block ${sub}`}>{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="text-sm text-slate-500 hover:text-red-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p className={sub}>Build and manage your AI-optimized resumes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Resumes", value: resumes.length, icon: "📄" },
            { label: "Best Score", value: resumes.length ? `${Math.max(...resumes.map(r => r.score || 0))}%` : "—", icon: "🏆" },
            { label: "Companies", value: new Set(resumes.map(r => r.targetCompany).filter(Boolean)).size, icon: "🏢" },
            { label: "Templates Used", value: new Set(resumes.map(r => r.template)).size, icon: "🎨" },
          ].map((s) => (
            <div key={s.label} className={`border ${card} rounded-xl p-4`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className={`text-xs ${sub}`}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Resumes Grid */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg">Your Resumes</h3>
          <button
            onClick={createNew}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
          >
            <span>+</span> New Resume
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading your resumes...</div>
        ) : resumes.length === 0 ? (
          <div className={`border-2 border-dashed ${dark ? "border-slate-800" : "border-slate-300"} rounded-2xl p-16 text-center`}>
            <div className="text-5xl mb-4">📄</div>
            <h4 className="font-semibold text-lg mb-2">No resumes yet</h4>
            <p className={`${sub} text-sm mb-6`}>Create your first AI-optimized resume in minutes</p>
            <button
              onClick={createNew}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Create First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* New Resume Card */}
            <button
              onClick={createNew}
              className={`border-2 border-dashed ${dark ? "border-slate-700 hover:border-indigo-600" : "border-slate-300 hover:border-indigo-400"} rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-colors group min-h-[180px]`}
            >
              <div className="w-12 h-12 rounded-full bg-indigo-600/10 group-hover:bg-indigo-600/20 flex items-center justify-center text-indigo-500 text-2xl transition-colors">+</div>
              <span className={`text-sm font-medium ${sub}`}>New Resume</span>
            </button>

            {resumes.map((r) => (
              <div
                key={r._id}
                onClick={() => navigate(`/builder/${r._id}`)}
                className={`border ${card} rounded-xl p-5 cursor-pointer hover:border-indigo-600/50 transition-all group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold truncate max-w-[180px]">{r.title}</h4>
                    <p className={`text-xs ${sub} mt-0.5`}>
                      {TEMPLATES[r.template]?.name || "ATS Friendly"}
                    </p>
                  </div>
                  {r.targetCompany && (
                    <span className="text-xs bg-indigo-600/15 text-indigo-400 px-2 py-0.5 rounded-full">
                      {r.targetCompany}
                    </span>
                  )}
                </div>

                {/* Score */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${r.score || 0}%`, background: scoreColor(r.score) }}
                    />
                  </div>
                  <span className="text-xs font-mono" style={{ color: scoreColor(r.score) }}>
                    {r.score || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs ${sub}`}>
                    {new Date(r.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => duplicateResume(r._id, e)}
                      className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded-lg transition-colors"
                    >Copy</button>
                    <button
                      onClick={(e) => deleteResume(r._id, e)}
                      className="text-xs bg-red-900/50 hover:bg-red-900 text-red-400 px-2 py-1 rounded-lg transition-colors"
                    >Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
