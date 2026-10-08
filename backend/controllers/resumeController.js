const Resume = require("../models/Resume");

// ── Get All Resumes ───────────────────────────────────────────────────────────
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select("title targetCompany template score updatedAt")
      .sort({ updatedAt: -1 });
    res.json({ resumes });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resumes." });
  }
};

// ── Get Single Resume ─────────────────────────────────────────────────────────
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!resume) return res.status(404).json({ error: "Resume not found." });
    res.json({ resume });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resume." });
  }
};

// ── Create Resume ─────────────────────────────────────────────────────────────
const createResume = async (req, res) => {
  try {
    const count = await Resume.countDocuments({ user: req.user._id });
    if (count >= 10 && req.user.plan === "free") {
      return res.status(403).json({ error: "Free plan allows up to 10 resumes." });
    }

    const resume = await Resume.create({
      user: req.user._id,
      title: req.body.title || "My Resume",
      ...req.body,
    });

    res.status(201).json({ resume });
  } catch (err) {
    console.error("Create resume error:", err);
    res.status(500).json({ error: "Failed to create resume." });
  }
};

// ── Update Resume ─────────────────────────────────────────────────────────────
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!resume) return res.status(404).json({ error: "Resume not found." });
    res.json({ resume });
  } catch (err) {
    res.status(500).json({ error: "Failed to update resume." });
  }
};

// ── Delete Resume ─────────────────────────────────────────────────────────────
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!resume) return res.status(404).json({ error: "Resume not found." });
    res.json({ message: "Resume deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete resume." });
  }
};

// ── Duplicate Resume ──────────────────────────────────────────────────────────
const duplicateResume = async (req, res) => {
  try {
    const original = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!original) return res.status(404).json({ error: "Resume not found." });

    const duplicate = original.toObject();
    delete duplicate._id;
    delete duplicate.createdAt;
    delete duplicate.updatedAt;
    duplicate.title = `${original.title} (Copy)`;

    const newResume = await Resume.create(duplicate);
    res.status(201).json({ resume: newResume });
  } catch (err) {
    res.status(500).json({ error: "Failed to duplicate resume." });
  }
};

module.exports = { getResumes, getResume, createResume, updateResume, deleteResume, duplicateResume };
