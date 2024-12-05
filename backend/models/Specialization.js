// model/Specialization.js

const mongoose = require('mongoose');

const specializationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: [
            "Artificial Intelligence",
            "Information Systems",
            "Computer Science",
            "Computer Networking",
            "Software Engineering"
        ]
    },
    moduleCorrelations: {
        type: Map,
        of: [Number]
    },
    mcqCorrelations: {
        type: Map,
        of: [[Number]]
    }
});

module.exports = mongoose.model('Specialization', specializationSchema);