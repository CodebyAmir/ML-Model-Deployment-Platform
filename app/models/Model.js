const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    name: String,
    path: String,
    version: { type: Number, default: 1 },
    uploadedAt: Date,
    lastInference: Date,
    inferenceCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Model', modelSchema);
