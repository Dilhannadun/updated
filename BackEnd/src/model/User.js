"use strict";

const mongoose = require('mongoose');

const userScheama = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min:4, 
        max:256
    },
    email:  {
        type: String,
        required: true,
        min: 4, 
        max: 256
    },
    password: {
        type: String,
        required: true,
        min: 4, 
        max: 1024
    },
    mobile: {
        type: String,
    },
    profilePicture: {
        type: String,
        min: 4, 
        max: 1024
    },
    role: {
        type: String,
        required: true,
        min:4, 
        max:20
    },
    notifications: [{
        type: mongoose.Types.ObjectId,
        ref: 'Notification',
        required: false
    }]
});

module.exports = mongoose.model("User", userScheama);