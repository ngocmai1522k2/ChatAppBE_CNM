const socketIO = require('socket.io');
const { Server } = require('socket.io');
const Message = require('../models/Message');
const User = require('../models/User');
const Conversation = require('../models/ConversationSchema');

let io = null;

module.exports = function (server) {
    io = new Server(server, { cors: { origin: '*' } });
    const users = {};
    const updateUserOnline = async (userId) => {
        const userUpdate = await User.findOneAndUpdate({ _id: userId }, { isOnline: true }, { new: true });
        console.log('userUpdate: ', userUpdate);
    };

    const updateUserOffline = async (userId) => {
        const userUpdate = await User.findOneAndUpdate({ _id: userId }, { isOnline: false }, { new: true });
        console.log('userUpdate: ', userUpdate);
    };

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            users[userId] = socket.id;
            socket.join(userId);
            updateUserOnline(userId);
        }
        console.log('a user connected with id: ', socket.id);
        io.emit('usersOnline', users);
        io.emit('userOnline', userId);

        socket.on('sendMessage', async (data) => {
            try {
                const { message, senderId, receiverIds } = data;
                if (receiverIds.length > 0) {
                    receiverIds.forEach(async (receiverId) => {
                        let conversation = await Conversation.findOne({
                            participants: { $all: [senderId, receiverId] },
                        });
                        if (!conversation) {
                            conversation = await Conversation.create({
                                participants: [senderId, receiverId],
                            });
                        }
                        const newMessage = new Message({
                            senderId,
                            receiverId,
                            message,
                        });
                        if (newMessage) {
                            conversation.messages.push(newMessage._id);
                        }
                        await Promise.all([conversation.save(), newMessage.save()]);

                        console.log('newMessage: ', newMessage);

                        socket.emit('newMessage', newMessage);

                        if (users[receiverId]) socket.to(users[receiverId]).emit('receiveMessage', newMessage);
                    });
                } else {
                    console.log('receiverIds is empty');
                }
            } catch (error) {
                console.log('Error sendMessage by socket io' + error);
            }
        });
    });
};

module.exports.io = io;
