const path = require('path');
const Model = require('../models/Model');
const { runModel, trackMetrics } = require('../services/modelService');

// Upload a model
exports.uploadModel = async (req, res) => {
    try {
        const modelData = new Model({
            name: req.body.name,
            path: req.file.path,
            version: req.body.version || 1,
            uploadedAt: new Date()
        });
        await modelData.save();
        res.status(201).json({ message: 'Model uploaded successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error uploading model' });
    }
};

// Perform inference
exports.runInference = async (req, res) => {
    try {
        const { modelName, input } = req.body;
        const modelData = await Model.findOne({ name: modelName }).sort({ version: -1 });
        if (!modelData) return res.status(404).json({ error: 'Model not found' });

        const result = await runModel(modelData.path, input);
        trackMetrics(modelData, { inferenceTime: result.time, success: true });
        res.status(200).json({ result: result.output });
    } catch (err) {
        res.status(500).json({ error: 'Error running inference' });
    }
};

// Get performance metrics
exports.getMetrics = async (req, res) => {
    try {
        const metrics = await getMetrics();
        res.status(200).json({ metrics });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching metrics' });
    }
};
