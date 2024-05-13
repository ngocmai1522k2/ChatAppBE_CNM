const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: '',
        },
        phone: {
            type: String,
            default: '',
        },
        dateOfBirth: {
            type: Date,
            default: new Date('2000-01-01'),
        },
        gender: {
            type: Boolean,
            default: false,
        },
        phoneBooks: {
            type: [{id:String, name: String, phone: String, avatar: String}],
            default: [],
        },
        invite:{
            type: [{ id:String,name: String, phone: String }],
            default: [],
        },
        // ban da gui loi moi cho ai
        listAddFriend:{
            type: [{ id:String,name: String, phone: String }],
            default: [],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        // accessToken: { type: String, require: true },
        // refreshToken: { type: String, require: true },
    },
    { timestamps: true },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
