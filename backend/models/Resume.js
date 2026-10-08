const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "My Resume",
      trim: true,
      maxlength: 100,
    },
    targetCompany: {
      type: String,
      enum: ["Google", "Microsoft", "Amazon", "Infosys", "TCS", "Accenture", ""],
      default: "",
    },
    template: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Personal Info
    name: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    linkedin: { type: String, default: "", trim: true },
    github: { type: String, default: "", trim: true },
    portfolio: { type: String, default: "", trim: true },

    // Career Objective
    objective: { type: String, default: "", maxlength: 1000 },

    // Education
    education: [
      {
        degree: { type: String, default: "" },
        institution: { type: String, default: "" },
        year: { type: String, default: "" },
        gpa: { type: String, default: "" },
      },
    ],

    // Skills
    skills: {
      technical: { type: String, default: "" },
      tools: { type: String, default: "" },
      soft: { type: String, default: "" },
    },

    // Projects
    projects: [
      {
        name: { type: String, default: "" },
        description: { type: String, default: "" },
        tech: { type: String, default: "" },
        link: { type: String, default: "" },
      },
    ],

    // Work Experience
    experience: [
      {
        role: { type: String, default: "" },
        company: { type: String, default: "" },
        duration: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],

    // Certifications
    certifications: [
      {
        name: { type: String, default: "" },
        issuer: { type: String, default: "" },
      },
    ],

    // Achievements
    achievements: { type: String, default: "" },

    // Metadata
    isPublic: { type: Boolean, default: false },
    lastOptimized: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Index for fast user queries
resumeSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model("Resume", resumeSchema);
