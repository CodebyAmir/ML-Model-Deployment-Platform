const fs = require('fs');
const { exec } = require('child_process');
const Model = require('../models/Model');
const path = require('path');

// Run the model on input data
exports.runModel = (modelPath, input) => {
    return new Promise((resolve, reject) => {
        const modelScript = path.resolve(modelPath);
        const inputData = JSON.stringify(input);

        exec(`python3 ${modelScript} '${inputData}'`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                console.error(`stderr: ${stderr}`);  // Log stderr to see what went wrong
                return reject(`Error: ${error.message}`);
            }
            console.log(`stdout: ${stdout}`);
            
            try {
                const output = JSON.parse(stdout);
                resolve({ output, time: Date.now() });
            } catch (err) {
                console.error(`Error parsing output: ${err.message}`);
                reject(`Error parsing output: ${err.message}`);
            }
        });
    });
};


// Track metrics such as inference time, model success rate
exports.trackMetrics = async (modelData, { inferenceTime, success }) => {
    modelData.lastInference = new Date();
    modelData.inferenceCount += 1;
    await modelData.save();
};

// Fetch overall metrics (e.g., inference time, request count)
exports.getMetrics = async () => {
    // You can aggregate metrics data from MongoDB here
    return {
        totalRequests: await Model.aggregate([{ $group: { _id: null, total: { $sum: "$inferenceCount" } } }]),
        averageInferenceTime: 120 // Placeholder for actual calculation
    };
};
