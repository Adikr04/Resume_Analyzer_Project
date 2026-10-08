export const COMPANIES = {
  Google: {
    color: "#4285F4",
    emoji: "🔵",
    keywords: [
      "scalability", "algorithms", "data structures", "system design",
      "machine learning", "distributed systems", "optimization", "APIs"
    ],
    skills: ["Python", "Java", "C++", "Go", "TensorFlow", "Kubernetes", "BigQuery", "GCP"],
    tip: "Emphasize algorithmic thinking, technical depth, and scale. Use precise metrics for every achievement.",
  },
  Microsoft: {
    color: "#00A4EF",
    emoji: "🟦",
    keywords: [
      "Azure", "cloud computing", "TypeScript", "agile", "collaboration",
      "enterprise", "accessibility", "DevOps"
    ],
    skills: ["TypeScript", "C#", ".NET", "Azure", "Power BI", "SQL Server", "React"],
    tip: "Highlight growth mindset, teamwork, and Microsoft ecosystem experience.",
  },
  Amazon: {
    color: "#FF9900",
    emoji: "🟠",
    keywords: [
      "leadership principles", "customer obsession", "ownership", "AWS",
      "scalable", "frugality", "bias for action", "deliver results"
    ],
    skills: ["AWS", "Java", "Python", "DynamoDB", "Lambda", "Microservices", "S3"],
    tip: "Frame EVERY experience using Amazon's Leadership Principles. Every bullet should show ownership and impact.",
  },
  Infosys: {
    color: "#007CC3",
    emoji: "🔷",
    keywords: [
      "digital transformation", "agile methodology", "ERP", "SAP",
      "client delivery", "process improvement", "automation"
    ],
    skills: ["Java", "SQL", "Spring Boot", "Angular", "SAP", "Selenium", "JIRA"],
    tip: "Show adaptability, eagerness to learn multiple technologies, and certifications.",
  },
  TCS: {
    color: "#0066B3",
    emoji: "🔹",
    keywords: [
      "innovation", "automation", "digital", "process improvement",
      "client focus", "quality assurance", "agile"
    ],
    skills: ["Java", "Python", "SQL", "REST APIs", "Selenium", "Jenkins", "Git"],
    tip: "Emphasize certifications, learning agility, versatility, and team collaboration.",
  },
  Accenture: {
    color: "#A100FF",
    emoji: "🟣",
    keywords: [
      "consulting", "cloud transformation", "AI/ML", "strategy",
      "digital innovation", "agile delivery", "stakeholder management"
    ],
    skills: ["Cloud", "Data Analytics", "Python", "Tableau", "Salesforce", "Power BI", "Agile"],
    tip: "Highlight business impact, problem-solving, client communication, and digital transformation expertise.",
  },
};

export const TEMPLATES = [
  { name: "ATS Friendly", icon: "📄", desc: "Parser-optimized, clean format" },
  { name: "Modern Dev", icon: "💻", desc: "Tech-forward, two-column layout" },
  { name: "Minimal", icon: "✨", desc: "Elegant typography, gold accents" },
  { name: "Corporate", icon: "🏢", desc: "Traditional, navy professional" },
];

export const STEPS = [
  { id: "personal", label: "Personal Info", icon: "👤" },
  { id: "objective", label: "Objective", icon: "🎯" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "skills", label: "Skills", icon: "💻" },
  { id: "projects", label: "Projects", icon: "⚡" },
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "awards", label: "Awards", icon: "🏆" },
  { id: "preview", label: "Preview", icon: "👁" },
];

export const DEFAULT_RESUME = {
  title: "My Resume",
  targetCompany: "",
  template: 0,
  name: "", phone: "", email: "", linkedin: "", github: "", portfolio: "",
  objective: "",
  education: [{ degree: "", institution: "", year: "", gpa: "" }],
  skills: { technical: "", tools: "", soft: "" },
  projects: [{ name: "", description: "", tech: "", link: "" }],
  experience: [{ role: "", company: "", duration: "", description: "" }],
  certifications: [{ name: "", issuer: "" }],
  achievements: "",
};
