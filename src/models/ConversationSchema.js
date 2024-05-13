const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Message',
                default: [],
            },
        ],
        groupName: {
            type: String,
            default: '',
        },
        idAdmin: {
            type: String,
            default: '',
        },
        avatarGroup: {
            type: String,
            default: '',
        },
    },
    { timestamps: true },
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
