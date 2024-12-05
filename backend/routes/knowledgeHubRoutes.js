const express = require("express");
const router = express.Router();
const knowledgeHubController = require("../controllers/knowledgeHubController");

router.get("/get-courses", knowledgeHubController.getCourses);

module.exports = router;
