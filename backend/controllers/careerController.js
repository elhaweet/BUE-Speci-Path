// controllers/careerController.js

const careerService = require("../services/careerService");

// Fetches all specializations and returns them in response
const getSpecializations = async (req, res) => {
  try {
    const specializations = await careerService.fetchAllSpecializations();
    if (specializations.length > 0) {
      res.json(specializations);
    } else {
      res.status(404).json({ message: "No specializations found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetches careers based on the provided specialization and returns them in response
const getCareers = async (req, res) => {
  try {
    const { specialization } = req.query;
    if (!specialization) {
      return res.status(400).json({ message: "Specialization is required" });
    }
    const careers = await careerService.fetchCareersForSpecialization(specialization);
    res.json(careers);
  } catch (error) {
    if (error.message === "Specialization not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  getSpecializations,
  getCareers,
};
