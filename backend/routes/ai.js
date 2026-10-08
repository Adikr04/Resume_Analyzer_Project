const express = require("express");
const router = express.Router();
const { optimizeResume, generateProjectDesc, scoreResume } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/optimize", optimizeResume);
router.post("/generate-description", generateProjectDesc);
router.post("/score", scoreResume);

module.exports = router;
