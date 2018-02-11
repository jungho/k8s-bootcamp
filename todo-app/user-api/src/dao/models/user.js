const mongoose = require('mongoose');
const {Schema} = mongoose;


const MODEL_NAME = 'User';
const User = new Schema({
    email: String,
    firstName: String,
    lastName: String
});

mongoose.model(MODEL_NAME, User);
module.exports = () => mongoose.model(MODEL_NAME);