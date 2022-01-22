const Joi = require('joi');
const mongoose = require('mongoose');

const foodDiarySchema = new mongoose.Schema({
    name: { type: String, required: true },
    servingSize: { type: String, required: true },
    protein: { type: String, required: true },
    fats: {type: String, required: true},
    sugars: {type: String, required: true},
    calories: { type: String, required: true },
    dateModified: { type: Date, default: Date.now }
})

const Food = mongoose.model('Food', foodDiarySchema);


function validateFood(food) {
    const schema = Joi.object({
        name: Joi.string().required(),
        servingSize: Joi.string().required(),
        protein: Joi.string().required(),
        fats: Joi.string().required(),
        sugars: Joi.string().required(),
        calories: Joi.string().required(),
    });

    return schema.validate(food);
}

exports.foodDiarySchema = foodDiarySchema;
exports.Food = Food;
exports.validateFood = validateFood;

