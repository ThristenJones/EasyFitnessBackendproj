const Joi = require('joi');
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    goal: { type: String, required: true },
    dateModified: { type: Date, default: Date.now }
});

const Goal = mongoose.model('Goal', goalSchema);

function validateGoal(goal) {
    const schema = Joi.object({
        goal: Joi.string().required(),
    });
    return schema.validate(goal);
}

exports.goalSchema = goalSchema;
exports.Goal = Goal;
exports.validateGoal = validateGoal;


