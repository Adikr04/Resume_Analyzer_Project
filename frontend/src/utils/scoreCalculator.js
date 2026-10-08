import { COMPANIES } from "../constants/companies";

export function calculateScore(data, company) {
  let score = 0;
  const tips = [];

  // Personal info — 20 pts
  const personalFields = ["name", "phone", "email", "linkedin", "github"];
  const filled = personalFields.filter((f) => data[f]?.trim()).length;
  score += (filled / personalFields.length) * 20;
  if (!data.linkedin) tips.push("Add your LinkedIn profile URL");
  if (!data.github) tips.push("Add your GitHub profile URL");

  // Objective — 10 pts
  const wordCount = data.objective?.trim().split(/\s+/).filter(Boolean).length || 0;
  if (wordCount > 50) score += 10;
  else if (wordCount > 20) score += 6;
  else if (wordCount > 0) score += 3;
  else tips.push("Write a career objective (aim for 30+ words)");

  // Education — 10 pts
  const hasEdu = data.education?.some((e) => e.degree && e.institution);
  if (hasEdu) score += 10;
  else tips.push("Add your education details");

  // Skills — 20 pts
  const skillList = (data.skills?.technical || "").split(",").filter((s) => s.trim());
  const skillCount = skillList.length;
  if (skillCount >= 10) score += 20;
  else if (skillCount >= 6) score += 14;
  else if (skillCount >= 3) score += 8;
  else if (skillCount > 0) score += 4;
  if (skillCount < 8) tips.push(`Add more skills (have ${skillCount}, aim for 8+)`);

  // Projects — 25 pts
  const goodProjects = (data.projects || []).filter(
    (p) => p.name && p.description && p.description.length > 30
  ).length;
  if (goodProjects >= 3) score += 25;
  else if (goodProjects >= 2) score += 18;
  else if (goodProjects >= 1) score += 10;
  else tips.push("Add 2-3 detailed projects with descriptions");
  if (goodProjects < 2) tips.push("Add more projects — aim for 3 strong ones");

  // Experience — 10 pts
  const hasExp = data.experience?.some((e) => e.role && e.company);
  if (hasExp) score += 10;
  else tips.push("Add internship or work experience (even freelance counts)");

  // Certifications — 5 pts
  const hasCerts = data.certifications?.some((c) => c.name);
  if (hasCerts) score += 5;
  else tips.push("Add certifications (AWS, Google, Coursera, etc.)");

  // Company keywords — 5 pts
  if (company && COMPANIES[company]) {
    const keywords = COMPANIES[company].keywords;
    const text = JSON.stringify(data).toLowerCase();
    const matches = keywords.filter((kw) => text.includes(kw.toLowerCase())).length;
    score += (matches / keywords.length) * 5;
    if (matches < keywords.length * 0.3) {
      tips.push(`Include ${company} keywords: ${keywords.slice(0, 3).join(", ")}`);
    }
  }

  const finalScore = Math.min(100, Math.round(score));
  const grade =
    finalScore >= 85 ? "Excellent" :
    finalScore >= 70 ? "Good" :
    finalScore >= 55 ? "Average" : "Needs Work";

  return {
    score: finalScore,
    grade,
    tips: tips.slice(0, 5),
    color: finalScore >= 80 ? "#22c55e" : finalScore >= 60 ? "#f59e0b" : "#ef4444",
  };
}
