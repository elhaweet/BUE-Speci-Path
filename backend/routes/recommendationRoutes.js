// routes/recommendationRoutes.js

const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recommendationController");

router.post("/recommend-specialization", recommendationController.getRecommendation);

module.exports = router;