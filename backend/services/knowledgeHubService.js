//  services/KnowledgHubService.js

const axios = require("axios");

const fetchCourses = async (query) => {
  try {
    const response = await axios.get(
      `https://api.coursera.org/api/courses.v1?q=search&query=${query}&includes=instructorIds,partnerIds&fields=name,description,photoUrl`
    );

    return response.data.elements.map((course) => ({
      title: course.name,
      description: course.description || "No description available",
      platform: "Coursera",
      url: course.slug
        ? `https://www.coursera.org/learn/${course.slug}`
        : "URL not available",
      image: course.photoUrl || "No image available",
    }));
  } catch (error) {
    throw new Error("Error fetching courses from Coursera: " + error.message);
  }
};

module.exports = {
  fetchCourses,
};
