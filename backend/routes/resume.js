const express = require("express");
const router = express.Router();
const {
  getResumes, getResume, createResume, updateResume, deleteResume, duplicateResume
} = require("../controllers/resumeController");
const { protect } = require("../middleware/auth");

router.use(protect); // All resume routes require authentication

router.get("/", getResumes);
router.post("/", createResume);
router.get("/:id", getResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);
router.post("/:id/duplicate", duplicateResume);

module.exports = router;
