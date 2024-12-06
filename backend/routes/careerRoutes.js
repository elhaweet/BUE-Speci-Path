// routes/careerRoutes.js

const express = require("express");
const router = express.Router();
const careerController = require("../controllers/careerController");

router.get("/get-specializations", careerController.getSpecializations);
router.get("/explore-career-options", careerController.getCareers);

module.exports = router;
