const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        required: true,
        enum: ["male","female","custom"]
    }
}, {timestamps: true});

module.exports = mongoose.model('User',userSchema);