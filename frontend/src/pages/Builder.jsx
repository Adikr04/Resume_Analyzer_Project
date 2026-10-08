import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../App";
import ResumePreview from "../components/ResumePreview";
import { calculateScore } from "../utils/scoreCalculator";
import { COMPANIES, TEMPLATES, STEPS, DEFAULT_RESUME } from "../constants/companies";

export default function Builder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const previewRef = useRef();

  const [data, setData] = useState(DEFAULT_RESUME);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTip, setAiTip] = useState("");
  const [score, setScore] = useState({ score: 0, grade: "Needs Work", tips: [], color: "#ef4444" });
  const [showPreview, setShowPreview] = useState(false);
  const [dark] = useState(true);
  const saveTimer = useRef(null);

  // Load resume
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    axios.get(`/api/resume/${id}`)
      .then(({ data: res }) => setData(res.resume))
      .catch(() => navigate("/dashboard"))
      .finally(() => setLoading(false));
  }, [id]);

  // Update score whenever data changes
  useEffect(() => {
    setScore(calculateScore(data, data.targetCompany));
  }, [data]);

  // Auto-save with debounce
  const autoSave = useCallback((payload) => {
    if (!id) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await axios.put(`/api/resume/${id}`, payload);
      } finally {
        setSaving(false);
      }
    }, 1800);
  }, [id]);

  const update = (key, value) => {
    const next = { ...data, [key]: value };
    setData(next);
    autoSave(next);
  };

  const updateNested = (key, index, field, value) => {
    const arr = [...(data[key] || [])];
    arr[index] = { ...arr[index], [field]: value };
    const next = { ...data, [key]: arr };
    setData(next);
    autoSave(next);
  };

  const addItem = (key, template) => {
    update(key, [...(data[key] || []), template]);
  };

  const removeItem = (key, index) => {
    update(key, (data[key] || []).filter((_, i) => i !== index));
  };

  // AI Optimization
  const runAI = async () => {
    setAiLoading(true);
    setAiTip("");
    try {
      const { data: res } = await axios.post("/api/ai/optimize", {
        resumeData: data,
        targetCompany: data.targetCompany,
      });
      const opt = res.optimized;
      const next = { ...data };
      if (opt.objective) next.objective = opt.objective;
      if (opt.projects?.length) {
        next.projects = data.projects.map((p) => {
          const improved = opt.projects.find((op) => op.name === p.name);
          return improved ? { ...p, description: improved.description } : p;
        });
      }
      if (opt.experience?.length) {
        next.experience = data.experience.map((e) => {
          const improved = opt.experience.find((oe) => oe.role === e.role);
          return improved ? { ...e, description: improved.description } : e;
        });
      }
      if (opt.suggestedSkills?.length) {
        const existing = data.skills.technical;
        const merged = [...new Set([...existing.split(","), ...opt.suggestedSkills])].filter(Boolean).join(", ");
        next.skills = { ...next.skills, technical: merged };
      }
      setData(next);
      autoSave(next);
      setAiTip(opt.tip || "Resume improved!");
    } catch (err) {
      setAiTip(err.response?.data?.error || "AI optimization failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // PDF Download
  const downloadPDF = async () => {
    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF } = await import("jspdf");
    const el = document.getElementById("resume-preview");
    if (!el) { alert("Please view the Preview tab first."); return; }
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
    pdf.save(`${data.name || "resume"}_${data.targetCompany || "resume"}.pdf`);
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#09090f", color: "#6366f1" }}>
      Loading...
    </div>
  );

  const inp = "w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors";
  const label = "block text-xs text-slate-400 mb-1";
  const fieldWrap = "mb-3";

  return (
    <div className={`min-h-screen bg-[#09090f] text-white`}>
      {/* Top Bar */}
      <div className="bg-[#0a0a14] border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-slate-400 hover:text-white text-sm">← Dashboard</button>
          <span className="text-slate-700">|</span>
          <input
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            className="bg-transparent text-white text-sm font-medium focus:outline-none border-b border-transparent focus:border-indigo-500 transition-colors px-1"
          />
          <span className="text-xs text-slate-600">{saving ? "Saving..." : "Saved ✓"}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowPreview(!showPreview); if (!showPreview) setStep(7); }}
            className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            {showPreview ? "✏ Edit" : "👁 Preview"}
          </button>
          <button
            onClick={downloadPDF}
            className="text-sm bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            ↓ PDF
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Sidebar Steps */}
        <div className="w-52 bg-[#0a0a14] border-r border-slate-800 py-4 flex flex-col shrink-0">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setStep(i); setShowPreview(i === 7); }}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${step === i ? "text-white bg-indigo-600/20 border-r-2 border-indigo-500" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}
            >
              <span className="text-base">{s.icon}</span> {s.label}
            </button>
          ))}

          {/* Score Ring */}
          <div className="mt-auto px-4 py-4">
            <div className="bg-slate-900 rounded-xl p-3 text-center border border-slate-800">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg viewBox="0 0 60 60" className="w-full h-full -rotate-90">
                  <circle cx="30" cy="30" r="24" fill="none" stroke="#1e293b" strokeWidth="5" />
                  <circle
                    cx="30" cy="30" r="24" fill="none"
                    stroke={score.color} strokeWidth="5"
                    strokeDasharray={`${(score.score / 100) * 150.8} 150.8`}
                    strokeLinecap="round" className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold" style={{ color: score.color }}>{score.score}</span>
                </div>
              </div>
              <div className="text-xs font-medium" style={{ color: score.color }}>{score.grade}</div>
              <div className="text-xs text-slate-500 mt-1">Resume Score</div>
            </div>
            {score.tips[0] && <p className="text-xs text-slate-500 mt-2 leading-relaxed">💡 {score.tips[0]}</p>}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Company Selector */}
          <div className="mb-5 bg-[#0f0f1a] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-slate-400 font-medium">🏢 Target Company:</span>
              {["", ...Object.keys(COMPANIES)].map((c) => (
                <button
                  key={c || "none"}
                  onClick={() => update("targetCompany", c)}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                    data.targetCompany === c
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {c || "General"}
                </button>
              ))}
            </div>
            {data.targetCompany && COMPANIES[data.targetCompany] && (
              <div className="mt-3 pt-3 border-t border-slate-800">
                <p className="text-xs text-slate-400 mb-2">
                  💡 <strong className="text-indigo-400">{data.targetCompany} tip:</strong> {COMPANIES[data.targetCompany].tip}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {COMPANIES[data.targetCompany].keywords.slice(0, 5).map((kw) => (
                    <span key={kw} className="text-xs bg-indigo-600/15 text-indigo-400 px-2 py-0.5 rounded-full">{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Template Selector */}
          <div className="mb-5 bg-[#0f0f1a] border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium block mb-3">🎨 Template:</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => update("template", i)}
                  className={`p-2.5 rounded-lg text-xs text-center border transition-all ${
                    data.template === i
                      ? "border-indigo-500 bg-indigo-600/15 text-white"
                      : "border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <div className="text-lg">{t.icon}</div>
                  <div className="font-medium mt-1">{t.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Steps */}
          <div className="bg-[#0f0f1a] border border-slate-800 rounded-xl p-5">
            {/* Step 0: Personal */}
            {step === 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-4">👤 Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  {[["name","Full Name","Rahul Sharma"],["phone","Phone","+91 9876543210"],["email","Email","rahul@email.com"],["linkedin","LinkedIn","linkedin.com/in/rahul"],["github","GitHub","github.com/rahul"],["portfolio","Portfolio","rahul.dev"]].map(([k,l,p]) => (
                    <div key={k} className={fieldWrap}>
                      <label className={label}>{l}</label>
                      <input className={inp} placeholder={p} value={data[k] || ""} onChange={e => update(k, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Objective */}
            {step === 1 && (
              <div>
                <h3 className="text-sm font-semibold mb-4">🎯 Career Objective</h3>
                {data.targetCompany && COMPANIES[data.targetCompany] && (
                  <div className="mb-3 p-3 bg-indigo-600/10 border border-indigo-600/30 rounded-lg text-xs text-indigo-300">
                    Tailoring for <strong>{data.targetCompany}</strong>: Include keywords like "{COMPANIES[data.targetCompany].keywords.slice(0,2).join(", ")}".
                  </div>
                )}
                <div className={fieldWrap}>
                  <label className={label}>Career Objective (30–60 words recommended)</label>
                  <textarea
                    rows={5}
                    className={inp + " resize-none"}
                    placeholder="Motivated Computer Science student seeking a software engineering internship at..."
                    value={data.objective || ""}
                    onChange={e => update("objective", e.target.value)}
                  />
                  <div className="text-xs text-slate-600 mt-1">{(data.objective || "").split(/\s+/).filter(Boolean).length} words</div>
                </div>
              </div>
            )}

            {/* Step 2: Education */}
            {step === 2 && (
              <div>
                <h3 className="text-sm font-semibold mb-4">🎓 Education</h3>
                {(data.education || []).map((e, i) => (
                  <div key={i} className="mb-4 p-4 bg-slate-900/60 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-slate-400">Entry {i + 1}</span>
                      {i > 0 && <button onClick={() => removeItem("education", i)} className="text-xs text-red-400 hover:text-red-300">Remove</button>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[["degree","Degree / Course","B.Tech Computer Science"],["institution","Institution","IIT Delhi"],["year","Year","2021–2025"],["gpa","GPA / %","8.5 / 10"]].map(([k,l,p]) => (
                        <div key={k}>
                          <label className={label}>{l}</label>
                          <input className={inp} placeholder={p} value={e[k]||""} onChange={ev => updateNested("education", i, k, ev.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={() => addItem("education", { degree:"", institution:"", year:"", gpa:"" })} className="text-xs text-indigo-400 hover:text-indigo-300 mt-1">+ Add Education</button>
              </div>
            )}

            {/* Step 3: Skills */}
            {step === 3 && (
              <div>
                <h3 className="text-sm font-semibold mb-4">💻 Skills</h3>
                {data.targetCompany && COMPANIES[data.targetCompany] && (
                  <div className="mb-4 p-3 bg-slate-900 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-400 mb-2">Recommended for {data.targetCompany}:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {COMPANIES[data.targetCompany].skills.map(s => (
                        <button
                          key={s}
                          onClick={() => {
                            const existing = data.skills.technical || "";
                            if (!existing.toLowerCase().includes(s.toLowerCase())) {
                              update("skills", { ...data.skills, technical: existing ? `${existing}, ${s}` : s });
                            }
                          }}
                          className="text-xs bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 px-2 py-0.5 rounded-full transition-colors"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {[["technical","Technical Skills","Python, React, Node.js, MongoDB, DSA"],["tools","Tools & Platforms","Git, Docker, VS Code, Figma, AWS"],["soft","Soft Skills","Leadership, Communication, Problem-solving"]].map(([k,l,p]) => (
                  <div key={k} className={fieldWrap}>
                    <label className={label}>{l} <span className="text-slate-600">(comma separated)</span></label>
                    <input className={inp} placeholder={p} value={data.skills?.[k]||""} onChange={e => update("skills", {...data.skills, [k]: e.target.value})} />
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Projects */}
            {step === 4 && (
              <div>
                <h3 className="text-sm font-semibold mb-4">⚡ Projects</h3>
                {(data.projects || []).map((p, i) => (
                  <div key={i} className="mb-4 p-4 bg-slate-900/60 rounded-lg border border-slate-800">
                    <div className="flex justify-between mb-3">
                      <span className="text-xs text-slate-400">Project {i + 1}</span>
                      {i > 0 && <button onClick={() => removeItem("projects", i)} className="text-xs text-red-400">Remove</button>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className={label}>Project Name</label>
                        <input className={inp} placeholder="E-Commerce App" value={p.name||""} onChange={e => updateNested("projects", i, "name", e.target.value)} />
                      </div>
                      <div>
                        <label className={label}>Tech Stack</label>
                        <input className={inp} placeholder="React, Node.js, MongoDB" value={p.tech||""} onChange={e => updateNested("projects", i, "tech", e.target.value)} />
                      </div>
                    </div>
                    <div className={fieldWrap}>
                      <label className={label}>Description <span className="text-slate-600">(use bullet points, start with action verbs)</span></label>
                      <textarea rows={3} className={inp + " resize-none"} placeholder="• Built a full-stack e-commerce platform serving 500+ users..." value={p.description||""} onChange={e => updateNested("projects", i, "description", e.target.value)} />
                    </div>
                    <div>
                      <label className={label}>Link</label>
                      <input className={inp} placeholder="github.com/rahul/project" value={p.link||""} onChange={e => updateNested("projects", i, "link", e.target.value)} />
                    </div>
                  </div>
                ))}
                <button onClick={() => addItem("projects", { name:"", description:"", tech:"", link:"" })} className="text-xs text-indigo-400 hover:text-indigo-300">+ Add Project</button>
              </div>
            )}

            {/* Step 5: Experience */}
            {step === 5 && (
              <div>
                <h3 className="text-sm font-semibold mb-4">💼 Work Experience / Internship</h3>
                {(data.experience || []).map((e, i) => (
                  <div key={i} className="mb-4 p-4 bg-slate-900/60 rounded-lg border border-slate-800">
                    <div className="flex justify-between mb-3">
                      <span className="text-xs text-slate-400">Role {i + 1}</span>
                      {i > 0 && <button onClick={() => removeItem("experience", i)} className="text-xs text-red-400">Remove</button>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {[["role","Role","Software Intern"],["company","Company","Google"],["duration","Duration","May–Aug 2024"]].map(([k,l,p]) => (
                        <div key={k}>
                          <label className={label}>{l}</label>
                          <input className={inp} placeholder={p} value={e[k]||""} onChange={ev => updateNested("experience", i, k, ev.target.value)} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className={label}>Description (bullet points)</label>
                      <textarea rows={3} className={inp + " resize-none"} placeholder="• Developed a feature reducing load time by 40%..." value={e.description||""} onChange={ev => updateNested("experience", i, "description", ev.target.value)} />
                    </div>
                  </div>
                ))}
                <button onClick={() => addItem("experience", { role:"", company:"", duration:"", description:"" })} className="text-xs text-indigo-400 hover:text-indigo-300">+ Add Experience</button>
              </div>
            )}

            {/* Step 6: Awards */}
            {step === 6 && (
              <div>
                <h3 className="text-sm font-semibold mb-4">🏆 Certifications & Achievements</h3>
                <div className="mb-5">
                  <label className="text-xs text-slate-400 font-medium block mb-3">Certifications</label>
                  {(data.certifications || []).map((c, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input className={inp} placeholder="AWS Cloud Practitioner" value={c.name||""} onChange={e => updateNested("certifications", i, "name", e.target.value)} />
                      <input className={inp} placeholder="Amazon" value={c.issuer||""} onChange={e => updateNested("certifications", i, "issuer", e.target.value)} />
                      {i > 0 && <button onClick={() => removeItem("certifications", i)} className="text-red-400 text-xs px-2">✕</button>}
                    </div>
                  ))}
                  <button onClick={() => addItem("certifications", {name:"",issuer:""})} className="text-xs text-indigo-400 mt-1 hover:text-indigo-300">+ Add Certification</button>
                </div>
                <div className={fieldWrap}>
                  <label className={label}>Achievements (one per line)</label>
                  <textarea rows={4} className={inp + " resize-none"} placeholder="• Winner, HackIndia 2024 — 1st place among 500 teams&#10;• Dean's List for 4 consecutive semesters" value={data.achievements||""} onChange={e => update("achievements", e.target.value)} />
                </div>
              </div>
            )}

            {/* Step 7: Preview */}
            {step === 7 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">👁 Live Preview</h3>
                  <button onClick={downloadPDF} className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                    ↓ Download PDF
                  </button>
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-2xl" style={{ transform: "scale(0.85)", transformOrigin: "top left", width: "117%" }}>
                  <ResumePreview data={data} template={data.template} />
                </div>
              </div>
            )}

            {/* Navigation */}
            {step !== 7 && (
              <div className="flex justify-between mt-5 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="text-sm text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                >← Back</button>
                <button
                  onClick={() => { if (step === 6) { setStep(7); setShowPreview(true); } else setStep(step + 1); }}
                  className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  {step === 6 ? "Preview Resume →" : "Next →"}
                </button>
              </div>
            )}
          </div>

          {/* AI Optimizer */}
          <div className="mt-4 bg-[#0f0f1a] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold">🤖 AI Optimizer</h4>
                <p className="text-xs text-slate-500 mt-0.5">Improve grammar, bullet points & tailoring{data.targetCompany ? ` for ${data.targetCompany}` : ""}</p>
              </div>
              <button
                onClick={runAI}
                disabled={aiLoading}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
              >
                {aiLoading ? "✦ Optimizing..." : "✦ Optimize with AI"}
              </button>
            </div>
            {aiTip && (
              <div className={`mt-3 text-xs p-2.5 rounded-lg ${aiTip.includes("failed") || aiTip.includes("error") ? "bg-red-900/20 text-red-400" : "bg-indigo-600/15 text-indigo-300"}`}>
                {aiTip}
              </div>
            )}
          </div>

          {/* Score Tips */}
          {score.tips.length > 1 && (
            <div className="mt-4 bg-[#0f0f1a] border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-slate-400 mb-2">📋 Improvement Suggestions</h4>
              {score.tips.map((t, i) => (
                <div key={i} className="text-xs text-slate-400 flex items-start gap-2 mb-1">
                  <span className="text-yellow-500 mt-0.5">•</span> {t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
