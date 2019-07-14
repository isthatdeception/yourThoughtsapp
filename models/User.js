// jshint esversion:6

const {model, Schema} = require('mongoose');

const userSchema = new Schema({
    ussername: String,
    password: String,
    email: String,
    createdAt: String
});

module.exports = model('User', userSchema);