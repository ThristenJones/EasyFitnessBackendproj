const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const { foodDiarySchema } = require('./food');
const { goalSchema } = require('./goal');


const userSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 2, maxlength: 50},
    email: { type: String, required: true, unique: true, minlength: 4},
    password: { type: String, required: true},
    foodDiary: { type: [foodDiarySchema], default: [] },
    goal: { type: [goalSchema], default: []}
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, name: this.name }, config.get('jwtSecret'))  
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema =Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(4).required(),
        password: Joi.string().min(3).max(20).required(),

    })

    return schema.validate(user);
}

function validateLogin(req) {
    const schema = Joi.object({
      email: Joi.string().min(2).max(255).required().email(),
      password: Joi.string().min(2).max(1024).required(),
    });
    return schema.validate(req);
  }

exports.User = User;
exports.validateUser = validateUser;
exports.validateLogin = validateLogin;