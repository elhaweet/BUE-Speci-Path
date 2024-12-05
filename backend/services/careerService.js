//  services/careerServices.js

const Career = require("../models/Career");

const fetchAllSpecializations = async () => {
  try {
    const specializations = await Career.find({}, { specialization: 1, _id: 0 });
    return specializations.map((item) => item.specialization);
  } catch (error) {
    throw new Error("Error fetching specializations: " + error.message);
  }
};

const fetchCareersForSpecialization = async (specialization) => {
  try {
    const careerData = await Career.findOne({ specialization });
    if (!careerData) {
      throw new Error("Specialization not found");
    }
    return careerData.careers;
  } catch (error) {
    throw new Error("Error fetching careers for specialization: " + error.message);
  }
};

module.exports = {
  fetchAllSpecializations,
  fetchCareersForSpecialization,
};
