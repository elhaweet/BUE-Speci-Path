const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema({
  specialization: { type: String, required: true },
  careers: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      requiredSkills: [{ type: String, required: true }],
    },
  ],
});

module.exports = mongoose.model("Career", careerSchema);