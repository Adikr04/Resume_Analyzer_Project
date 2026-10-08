// ResumePreview.jsx — Renders resume in selected template style
export default function ResumePreview({ data, template = 0 }) {
  const T = [ATSTemplate, ModernDevTemplate, MinimalTemplate, CorporateTemplate][template] || ATSTemplate;
  return <T data={data} />;
}

// ── Shared helpers ────────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <div style={{ marginBottom: "16px" }}>
    <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#4f46e5", borderBottom: "1px solid #e2e8f0", paddingBottom: "2px", marginBottom: "6px" }}>
      {title}
    </div>
    {children}
  </div>
);

const BulletList = ({ text }) => {
  if (!text) return null;
  const lines = text.split("\n").map(l => l.replace(/^[-•]\s*/, "").trim()).filter(Boolean);
  return (
    <ul style={{ paddingLeft: "12px", margin: 0 }}>
      {lines.map((l, i) => <li key={i} style={{ fontSize: "9px", color: "#374151", marginBottom: "2px" }}>{l}</li>)}
    </ul>
  );
};

// ── Template 0: ATS Friendly ──────────────────────────────────────────────────
function ATSTemplate({ data }) {
  return (
    <div id="resume-preview" style={{ fontFamily: "'Arial', sans-serif", fontSize: "10px", color: "#1f2937", background: "white", padding: "32px", maxWidth: "680px", margin: "0 auto", lineHeight: 1.5 }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "16px", borderBottom: "2px solid #1f2937", paddingBottom: "12px" }}>
        <div style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "1px" }}>{data.name || "Your Name"}</div>
        <div style={{ fontSize: "9px", color: "#6b7280", marginTop: "4px" }}>
          {[data.phone, data.email, data.linkedin && `LinkedIn: ${data.linkedin}`, data.github && `GitHub: ${data.github}`].filter(Boolean).join(" | ")}
        </div>
      </div>
      {data.objective && <Section title="Professional Summary"><p style={{ fontSize: "9px", color: "#374151", margin: 0 }}>{data.objective}</p></Section>}
      {data.education?.some(e => e.degree) && (
        <Section title="Education">
          {data.education.filter(e => e.degree).map((e, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <div><div style={{ fontWeight: 700, fontSize: "9px" }}>{e.degree}</div><div style={{ fontSize: "9px", color: "#6b7280" }}>{e.institution}{e.gpa ? ` | GPA: ${e.gpa}` : ""}</div></div>
              <div style={{ fontSize: "9px", color: "#6b7280" }}>{e.year}</div>
            </div>
          ))}
        </Section>
      )}
      {data.skills?.technical && (
        <Section title="Technical Skills">
          <p style={{ fontSize: "9px", margin: 0, color: "#374151" }}>
            <strong>Technical:</strong> {data.skills.technical}
            {data.skills.tools && <span> | <strong>Tools:</strong> {data.skills.tools}</span>}
          </p>
        </Section>
      )}
      {data.projects?.some(p => p.name) && (
        <Section title="Projects">
          {data.projects.filter(p => p.name).map((p, i) => (
            <div key={i} style={{ marginBottom: "6px" }}>
              <div style={{ fontWeight: 700, fontSize: "9px" }}>{p.name} {p.tech && <span style={{ fontWeight: 400, color: "#6b7280" }}>| {p.tech}</span>}</div>
              <BulletList text={p.description} />
            </div>
          ))}
        </Section>
      )}
      {data.experience?.some(e => e.role) && (
        <Section title="Work Experience">
          {data.experience.filter(e => e.role).map((e, i) => (
            <div key={i} style={{ marginBottom: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 700, fontSize: "9px" }}>{e.role} — {e.company}</div>
                <div style={{ fontSize: "9px", color: "#6b7280" }}>{e.duration}</div>
              </div>
              <BulletList text={e.description} />
            </div>
          ))}
        </Section>
      )}
      {data.certifications?.some(c => c.name) && (
        <Section title="Certifications">
          {data.certifications.filter(c => c.name).map((c, i) => (
            <div key={i} style={{ fontSize: "9px" }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ""}</div>
          ))}
        </Section>
      )}
      {data.achievements && <Section title="Achievements"><BulletList text={data.achievements} /></Section>}
    </div>
  );
}

// ── Template 1: Modern Dev ────────────────────────────────────────────────────
function ModernDevTemplate({ data }) {
  return (
    <div id="resume-preview" style={{ fontFamily: "'Segoe UI', sans-serif", background: "white", maxWidth: "680px", margin: "0 auto", display: "flex", minHeight: "800px" }}>
      {/* Left sidebar */}
      <div style={{ width: "220px", background: "#0f172a", color: "white", padding: "28px 18px", flexShrink: 0 }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>
          {(data.name || "?")[0].toUpperCase()}
        </div>
        <div style={{ fontSize: "16px", fontWeight: 700 }}>{data.name || "Your Name"}</div>
        <div style={{ fontSize: "9px", color: "#94a3b8", marginTop: "4px", marginBottom: "16px" }}>Developer</div>
        <div style={{ fontSize: "8.5px", color: "#cbd5e1", lineHeight: 1.8 }}>
          {data.phone && <div>📱 {data.phone}</div>}
          {data.email && <div>✉ {data.email}</div>}
          {data.github && <div>⌥ {data.github}</div>}
          {data.linkedin && <div>in {data.linkedin}</div>}
        </div>
        {data.skills?.technical && (
          <div style={{ marginTop: "20px" }}>
            <div style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#4f46e5", marginBottom: "8px" }}>Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {data.skills.technical.split(",").filter(s => s.trim()).map((s, i) => (
                <span key={i} style={{ background: "#1e293b", color: "#a5b4fc", fontSize: "7.5px", padding: "2px 6px", borderRadius: "4px" }}>{s.trim()}</span>
              ))}
            </div>
          </div>
        )}
        {data.certifications?.some(c => c.name) && (
          <div style={{ marginTop: "20px" }}>
            <div style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#4f46e5", marginBottom: "8px" }}>Certs</div>
            {data.certifications.filter(c => c.name).map((c, i) => (
              <div key={i} style={{ fontSize: "8px", color: "#cbd5e1", marginBottom: "3px" }}>✓ {c.name}</div>
            ))}
          </div>
        )}
      </div>
      {/* Right content */}
      <div style={{ flex: 1, padding: "28px 22px", fontSize: "9px", color: "#1f2937" }}>
        {data.objective && (
          <div style={{ marginBottom: "16px", padding: "10px 14px", background: "#f0f4ff", borderLeft: "3px solid #4f46e5", borderRadius: "0 6px 6px 0" }}>
            <p style={{ margin: 0, fontSize: "9px", lineHeight: 1.6 }}>{data.objective}</p>
          </div>
        )}
        {data.projects?.some(p => p.name) && (
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#0f172a", marginBottom: "8px", paddingBottom: "3px", borderBottom: "2px solid #4f46e5" }}>PROJECTS</div>
            {data.projects.filter(p => p.name).map((p, i) => (
              <div key={i} style={{ marginBottom: "8px" }}>
                <div style={{ fontWeight: 700, fontSize: "9.5px" }}>{p.name} {p.tech && <span style={{ fontWeight: 400, color: "#4f46e5", fontSize: "8.5px" }}>({p.tech})</span>}</div>
                <p style={{ margin: "2px 0 0", fontSize: "8.5px", color: "#475569" }}>{p.description}</p>
              </div>
            ))}
          </div>
        )}
        {data.experience?.some(e => e.role) && (
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#0f172a", marginBottom: "8px", paddingBottom: "3px", borderBottom: "2px solid #4f46e5" }}>EXPERIENCE</div>
            {data.experience.filter(e => e.role).map((e, i) => (
              <div key={i} style={{ marginBottom: "8px" }}>
                <div style={{ fontWeight: 700 }}>{e.role}</div>
                <div style={{ color: "#4f46e5", fontSize: "8.5px" }}>{e.company} | {e.duration}</div>
                <BulletList text={e.description} />
              </div>
            ))}
          </div>
        )}
        {data.education?.some(e => e.degree) && (
          <div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#0f172a", marginBottom: "8px", paddingBottom: "3px", borderBottom: "2px solid #4f46e5" }}>EDUCATION</div>
            {data.education.filter(e => e.degree).map((e, i) => (
              <div key={i} style={{ marginBottom: "6px" }}>
                <div style={{ fontWeight: 700 }}>{e.degree}</div>
                <div style={{ color: "#6b7280", fontSize: "8.5px" }}>{e.institution} | {e.year}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Template 2: Minimal ───────────────────────────────────────────────────────
function MinimalTemplate({ data }) {
  return (
    <div id="resume-preview" style={{ fontFamily: "'Georgia', serif", fontSize: "9.5px", color: "#1f2937", background: "white", padding: "36px 40px", maxWidth: "680px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#1f2937" }}>{data.name || "Your Name"}</div>
        <div style={{ width: "40px", height: "2px", background: "#d4a017", margin: "8px auto" }} />
        <div style={{ fontSize: "8.5px", color: "#6b7280", letterSpacing: "0.5px" }}>
          {[data.email, data.phone, data.linkedin].filter(Boolean).join("  ·  ")}
        </div>
      </div>
      {data.objective && (
        <div style={{ textAlign: "center", marginBottom: "20px", fontStyle: "italic", color: "#4b5563", fontSize: "9px", lineHeight: 1.7 }}>
          {data.objective}
        </div>
      )}
      {data.education?.some(e => e.degree) && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "#d4a017", textAlign: "center", marginBottom: "8px" }}>Education</div>
          {data.education.filter(e => e.degree).map((e, i) => (
            <div key={i} style={{ textAlign: "center", marginBottom: "6px" }}>
              <div style={{ fontWeight: 700, fontSize: "9.5px" }}>{e.degree}</div>
              <div style={{ color: "#6b7280", fontSize: "8.5px" }}>{e.institution} | {e.year}</div>
            </div>
          ))}
        </div>
      )}
      {data.skills?.technical && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "#d4a017", textAlign: "center", marginBottom: "8px" }}>Skills</div>
          <p style={{ textAlign: "center", color: "#374151", fontSize: "8.5px", margin: 0 }}>{data.skills.technical}</p>
        </div>
      )}
      {data.projects?.some(p => p.name) && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "#d4a017", textAlign: "center", marginBottom: "8px" }}>Projects</div>
          {data.projects.filter(p => p.name).map((p, i) => (
            <div key={i} style={{ marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ fontWeight: 700, textAlign: "center" }}>{p.name} {p.tech && <span style={{ fontWeight: 400, color: "#6b7280" }}>· {p.tech}</span>}</div>
              <p style={{ margin: "3px 0 0", color: "#4b5563", fontSize: "8.5px", textAlign: "center" }}>{p.description}</p>
            </div>
          ))}
        </div>
      )}
      {data.experience?.some(e => e.role) && (
        <div>
          <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "#d4a017", textAlign: "center", marginBottom: "8px" }}>Experience</div>
          {data.experience.filter(e => e.role).map((e, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>{e.role} — {e.company}</span>
                <span style={{ color: "#6b7280", fontSize: "8.5px" }}>{e.duration}</span>
              </div>
              <BulletList text={e.description} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Template 3: Corporate ─────────────────────────────────────────────────────
function CorporateTemplate({ data }) {
  return (
    <div id="resume-preview" style={{ fontFamily: "'Calibri', 'Arial', sans-serif", fontSize: "9.5px", color: "#1f2937", background: "white", maxWidth: "680px", margin: "0 auto" }}>
      {/* Navy Header */}
      <div style={{ background: "#1e3a5f", color: "white", padding: "24px 32px" }}>
        <div style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "0.5px" }}>{data.name || "Your Name"}</div>
        <div style={{ fontSize: "8.5px", color: "#93c5fd", marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {data.phone && <span>📱 {data.phone}</span>}
          {data.email && <span>✉ {data.email}</span>}
          {data.linkedin && <span>🔗 {data.linkedin}</span>}
          {data.github && <span>⌥ {data.github}</span>}
        </div>
      </div>
      <div style={{ padding: "24px 32px" }}>
        {data.objective && (
          <div style={{ marginBottom: "14px", padding: "10px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "4px" }}>
            <p style={{ margin: 0, fontSize: "9px", color: "#1e3a5f", lineHeight: 1.6 }}>{data.objective}</p>
          </div>
        )}
        {["Education", "Skills", "Projects", "Experience", "Certifications"].map((section) => {
          const sectionStyle = { fontSize: "10px", fontWeight: 700, color: "white", background: "#1e3a5f", padding: "4px 10px", marginBottom: "8px", marginTop: "12px", letterSpacing: "0.5px" };
          if (section === "Education" && data.education?.some(e => e.degree)) return (
            <div key={section}><div style={sectionStyle}>{section.toUpperCase()}</div>
              {data.education.filter(e => e.degree).map((e, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <div><div style={{ fontWeight: 700, fontSize: "9.5px" }}>{e.degree}</div><div style={{ color: "#6b7280", fontSize: "8.5px" }}>{e.institution}</div></div>
                  <div style={{ color: "#6b7280", fontSize: "8.5px" }}>{e.year}</div>
                </div>
              ))}
            </div>
          );
          if (section === "Skills" && data.skills?.technical) return (
            <div key={section}><div style={sectionStyle}>{section.toUpperCase()}</div>
              <p style={{ margin: 0, fontSize: "9px" }}><strong>Technical:</strong> {data.skills.technical}</p>
              {data.skills.tools && <p style={{ margin: "3px 0 0", fontSize: "9px" }}><strong>Tools:</strong> {data.skills.tools}</p>}
            </div>
          );
          if (section === "Projects" && data.projects?.some(p => p.name)) return (
            <div key={section}><div style={sectionStyle}>{section.toUpperCase()}</div>
              {data.projects.filter(p => p.name).map((p, i) => (
                <div key={i} style={{ marginBottom: "8px" }}>
                  <div style={{ fontWeight: 700, fontSize: "9.5px" }}>{p.name} {p.tech && <span style={{ fontWeight: 400, color: "#6b7280" }}>({p.tech})</span>}</div>
                  <BulletList text={p.description} />
                </div>
              ))}
            </div>
          );
          if (section === "Experience" && data.experience?.some(e => e.role)) return (
            <div key={section}><div style={sectionStyle}>{section.toUpperCase()}</div>
              {data.experience.filter(e => e.role).map((e, i) => (
                <div key={i} style={{ marginBottom: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: 700, fontSize: "9.5px" }}>{e.role}</div>
                    <div style={{ color: "#6b7280", fontSize: "8.5px" }}>{e.duration}</div>
                  </div>
                  <div style={{ color: "#1e3a5f", fontSize: "8.5px", fontWeight: 600 }}>{e.company}</div>
                  <BulletList text={e.description} />
                </div>
              ))}
            </div>
          );
          if (section === "Certifications" && data.certifications?.some(c => c.name)) return (
            <div key={section}><div style={sectionStyle}>{section.toUpperCase()}</div>
              {data.certifications.filter(c => c.name).map((c, i) => (
                <div key={i} style={{ fontSize: "9px", marginBottom: "2px" }}>✓ {c.name}{c.issuer ? ` — ${c.issuer}` : ""}</div>
              ))}
            </div>
          );
          return null;
        })}
        {data.achievements && (
          <div><div style={{ fontSize: "10px", fontWeight: 700, color: "white", background: "#1e3a5f", padding: "4px 10px", marginBottom: "8px", marginTop: "12px" }}>ACHIEVEMENTS</div>
            <BulletList text={data.achievements} />
          </div>
        )}
      </div>
    </div>
  );
}
