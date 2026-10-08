const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const COMPANY_CONTEXT = {
  Google: "algorithms, scalability, system design, machine learning, distributed systems, clean code",
  Microsoft: "Azure cloud, TypeScript, agile methodology, growth mindset, accessibility, DevOps",
  Amazon: "AWS, customer obsession, ownership, bias for action, frugality, leadership principles",
  Infosys: "digital transformation, ERP, client delivery, process improvement, agile",
  TCS: "innovation, automation, quality, versatility, certifications",
  Accenture: "consulting, cloud transformation, AI/ML, business impact, strategy",
};

// ── Optimize Resume ───────────────────────────────────────────────────────────
const optimizeResume = async (req, res) => {
  try {
    const { resumeData, targetCompany } = req.body;

    if (!resumeData) {
      return res.status(400).json({ error: "Resume data is required." });
    }

    const companyContext = targetCompany && COMPANY_CONTEXT[targetCompany]
      ? `\nTarget Company: ${targetCompany}\nKey themes to emphasize: ${COMPANY_CONTEXT[targetCompany]}`
      : "";

    const prompt = `You are an expert resume writer for students applying for tech internships and entry-level jobs.${companyContext}

Analyze and improve the following resume data. Focus on:
1. Making the career objective compelling and specific (2-3 sentences)
2. Converting project descriptions to strong action-verb bullet points showing impact
3. Improving experience descriptions with quantifiable achievements
4. Suggesting 3-5 missing but relevant skills

Resume Data:
${JSON.stringify(
  {
    objective: resumeData.objective,
    skills: resumeData.skills,
    projects: (resumeData.projects || []).filter((p) => p.name),
    experience: (resumeData.experience || []).filter((e) => e.role),
  },
  null,
  2
)}

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "objective": "improved career objective here",
  "projects": [{"name": "exact project name", "description": "improved description with action verbs and impact metrics"}],
  "experience": [{"role": "exact role", "company": "exact company", "description": "improved bullet points"}],
  "suggestedSkills": ["skill1", "skill2", "skill3"],
  "grammarFixes": 3,
  "tip": "single most important improvement tip for this student"
}`;

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = message.content[0]?.text || "";
    const clean = responseText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      return res.status(500).json({ error: "AI returned invalid response. Please try again." });
    }

    res.json({
      success: true,
      optimized: parsed,
      tokensUsed: message.usage?.input_tokens + message.usage?.output_tokens,
    });
  } catch (err) {
    console.error("AI optimize error:", err);
    if (err.status === 529) {
      return res.status(503).json({ error: "AI service is overloaded. Please try again in a moment." });
    }
    res.status(500).json({ error: "AI optimization failed. Please try again." });
  }
};

// ── Generate Project Description ──────────────────────────────────────────────
const generateProjectDesc = async (req, res) => {
  try {
    const { projectName, techStack, targetCompany } = req.body;

    if (!projectName) {
      return res.status(400).json({ error: "Project name is required." });
    }

    const prompt = `Write a compelling resume project description for a student's project called "${projectName}" built with ${techStack || "web technologies"}.${targetCompany ? ` Tailor it for applying to ${targetCompany}.` : ""}

Requirements:
- 2-3 sentences
- Start with a strong action verb
- Include technical detail and user impact
- Mention scale/metrics if plausible for a student project
- Professional tone

Respond ONLY with the description text, nothing else.`;

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ description: message.content[0]?.text?.trim() });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate description." });
  }
};

// ── Score Resume ──────────────────────────────────────────────────────────────
const scoreResume = async (req, res) => {
  try {
    const { resumeData, targetCompany } = req.body;

    // Client-side scoring is also available — this is the AI-enhanced version
    const prompt = `You are an ATS expert and resume reviewer. Score this student resume out of 100 and provide specific feedback.

${targetCompany ? `Target Company: ${targetCompany}` : ""}
Resume: ${JSON.stringify(resumeData, null, 2)}

Score based on:
- Personal information completeness (15 pts)
- Career objective quality (10 pts)
- Education (10 pts)
- Skills relevance and count (20 pts)
- Project quality and descriptions (25 pts)
- Work experience (10 pts)
- Certifications and achievements (5 pts)
- ${targetCompany ? "Company-specific keywords (5 pts)" : "ATS keyword density (5 pts)"}

Respond ONLY with valid JSON:
{
  "score": 75,
  "breakdown": {
    "personalInfo": 12,
    "objective": 7,
    "education": 9,
    "skills": 15,
    "projects": 18,
    "experience": 8,
    "certifications": 4,
    "keywords": 2
  },
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["specific actionable improvement 1", "improvement 2", "improvement 3"],
  "atsCompatibility": "high|medium|low",
  "verdict": "one sentence overall assessment"
}`;

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });

    const clean = message.content[0]?.text?.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.json({ success: true, scoreData: parsed });
  } catch (err) {
    console.error("AI score error:", err);
    res.status(500).json({ error: "AI scoring failed." });
  }
};

module.exports = { optimizeResume, generateProjectDesc, scoreResume };
