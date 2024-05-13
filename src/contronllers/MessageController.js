const Conversation = require('../models/ConversationSchema.js');
const Message = require('../models/Message.js');
// const { getReceiverSocketId, io } = require("../socket/socket.js");

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        console.log('message: ', message);
        const { id: receiverId } = req.params;
        console.log('receiverId: ', receiverId);
        console.log('req.user: ', req.user);
        const senderId = req.user._id;
        console.log('senderId: ', senderId);

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

        // await conversation.save();
        // await newMessage.save();

        // this will run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        // SOCKET IO FUNCTIONALITY WILL GO HERE
        // const receiverSocketId = getReceiverSocketId(receiverId);
        // if (receiverSocketId) {
        // 	// io.to(<socket_id>).emit() used to send events to specific client
        // 	io.to(receiverSocketId).emit("newMessage", newMessage);
        // }
        console.log('newMessage: ', newMessage);
        res.status(201).json(newMessage);
    } catch (error) {
        console.log('Error in sendMessage controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate('messages'); // NOT REFERENCE BUT ACTUAL MESSAGES

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log('Error in getMessages controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const sendUploadFile = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let fileData = null;
        let filePath = null;

        if (req.file) {
            fileData = req.file.buffer; // Dá»¯ liá»‡u cá»§a file
            filePath = req.file.path; // ÄÆ°á»ng dáº«n táº¡m thá»i cá»§a file
            console.log('ÄÆ°á»ng dáº«n cá»§a file:', filePath);
        }

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
            file: fileData,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        // const receiverSocketId = getReceiverSocketId(receiverId);
        // if (receiverSocketId) {
        //     io.to(receiverSocketId).emit('newMessage', newMessage);
        // }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log('Error in sendUploadFile controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const sendMessageOnApp = async (req, res) => {
    try {
        const { message, userId } = req.body; // Láº¥y userId tá»« req.body
        console.log('message: ', message);
        const { id: receiverId } = req.params;
        console.log('receiverId: ', receiverId);
        const senderId = userId; // userId nÃ y sáº½ Ä‘Æ°á»£c gá»­i tá»« App
        console.log('senderId: ', senderId);

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

        // await conversation.save();
        // await newMessage.save();

        // this will run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        // SOCKET IO FUNCTIONALITY WILL GO HERE
        // const receiverSocketId = getReceiverSocketId(receiverId);
        // if (receiverSocketId) {
        // 	// io.to(<socket_id>).emit() used to send events to specific client
        // 	io.to(receiverSocketId).emit("newMessage", newMessage);
        // }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log('Error in sendMessage controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getMessagesOnApp = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        console.log('userToChatId: ', userToChatId);
        const senderId = req.query.senderId; // Láº¥y senderId tá»« query
        console.log('senderId: ', senderId);

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate('messages'); // NOT REFERENCE BUT ACTUAL MESSAGES
        console.log('conversation: ', conversation);

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log('Error in getMessages controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// send file or pictrue on app
const sendUploadFileOnApp = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.query.senderId;

        let fileData = null;
        let filePath = null;

        if (req.file) {
            fileData = req.file.buffer;
            filePath = req.file.path; // Đường dẫn tạm thời của file
            console.log('Đường dẫn của file:', filePath);
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const message = req.file.location || filePath; // Sử dụng req.file.location nếu tồn tại, nếu không sử dụng filePath

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        // const receiverSocketId = getReceiverSocketId(receiverId);
        // if (receiverSocketId) {
        //     io.to(receiverSocketId).emit('newMessage', newMessage);
        // }

        let data = {};
        if (!!req.file) {
            data = {
                url: req.file.location || filePath, // Sử dụng req.file.location nếu tồn tại, nếu không sử dụng filePath
                type: req.file.mimetype,
            };
        }

        const resultMessage = {
            ...newMessage.toObject(),
            data: data,
            status: true,
        };

        res.status(201).json(resultMessage);
    } catch (error) {
        console.log('Error in sendUploadFile controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { sendMessage, getMessages, sendUploadFile, sendMessageOnApp, getMessagesOnApp, sendUploadFileOnApp };
