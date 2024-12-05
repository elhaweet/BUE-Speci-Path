const knowledgeHubService = require("../services/knowledgeHubService");

const getCourses = async (req, res) => {
  try {
    const { query } = req.query; // Extract the search query from the request
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const courses = await knowledgeHubService.fetchCourses(query);
    if (courses.length > 0) {
      res.json(courses);
    } else {
      res.status(404).json({ error: "No courses found" });
    }
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

module.exports = {
  getCourses,
};
