const Conversation = require('../models/ConversationSchema.js');
const Message = require('../models/Message');

// delete conversation
const deleteConversation = async (req, res) => {
    try {
        const { id } = req.params;

        // Xóa cuộc trò chuyện với id được cung cấp
        const deletedConversation = await Conversation.findByIdAndDelete(id);

        if (!deletedConversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllConversationOfUser = async (req, res) => {
    try {
        const { id: userId } = req.params;
        console.log('userId: ', userId);
        // Tìm tất cả các cuộc trò chuyện mà người dùng tham gia dưới dạng participant
        const conversations = await Conversation.find({
            participants: { $elemMatch: { $eq: userId } },
        }).populate('participants');
        console.log('conversations: ', conversations);
        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
    }
};
const createGroup = async (req, res) => {
    try {
        const { groupName, participants, admin } = req.body; // Lấy dữ liệu từ body của yêu cầu
        // Tạo một cuộc trò chuyện mới
        console.log('req.body: ', req.body);
        const conversation = new Conversation({
            groupName: groupName,
            participants: participants,
            idAdmin: admin,
        });
        await conversation.save(); // Lưu cuộc trò chuyện vào cơ sở dữ liệu
        res.status(201).json(conversation); // Trả về dữ liệu của cuộc trò chuyện đã tạo
    } catch (error) {
        console.error('Lỗi quá trình tạo group:', error);
        res.status(500).json({ error: 'Lỗi quá trình tạo group' });
    }
};
const getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const conversation = await Conversation.findById(groupId).populate('messages');

        if (!conversation) {
            return res.status(404).json({ error: 'Không tìm thấy cuộc trò chuyện' });
        }

        const messages = conversation.messages;
        console.log('messages: ', messages);

        res.status(200).json({ messages });
    } catch (error) {
        console.error('Lỗi khi lấy tin nhắn của nhóm:', error);
        res.status(500).json({ error: 'Lỗi khi lấy tin nhắn của nhóm' });
    }
};

const sendMessageToGroup = async (req, res) => {
    try {
        const { groupId, senderId, message } = req.body; // Nhận dữ liệu từ client

        // Tạo một tin nhắn mới
        const newMessage = new Message({
            senderId: senderId,
            receiverId: groupId,
            message: message,
        });

        // Lưu tin nhắn mới vào cơ sở dữ liệu
        await newMessage.save();

        // Thêm ID của tin nhắn mới vào mảng tin nhắn của nhóm
        const conversation = await Conversation.findById(groupId);
        if (!conversation) {
            return res.status(404).json({ error: 'Không tìm thấy cuộc trò chuyện' });
        }
        conversation.messages.push(newMessage._id);

        // Lưu lại thông tin cập nhật của nhóm
        await conversation.save();

        // Gửi phản hồi về cho client
        res.status(201).json({ message: 'Tin nhắn đã được gửi thành công' });
    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn đến nhóm:', error);
        res.status(500).json({ error: 'Lỗi khi gửi tin nhắn đến nhóm' });
    }
};
const sendUploadFileToGroup = async (req, res) => {
    try {
        const { id: groupId } = req.params; // Sử dụng req.params để lấy id từ URL params
        const { senderId } = req.query; // Lấy senderId từ query params

        if (!req.file) {
            return res.status(400).json({ error: 'Không có file được tải lên' });
        }

        const message = req.file.location; // Lấy đường dẫn của file từ req.file.location

        // Tạo một tin nhắn mới
        const newMessage = new Message({
            senderId: senderId,
            receiverId: groupId,
            message: message,
        });

        // Lưu tin nhắn mới vào cơ sở dữ liệu
        await newMessage.save();

        // Thêm ID của tin nhắn mới vào mảng tin nhắn của nhóm
        const conversation = await Conversation.findById(groupId);
        if (!conversation) {
            return res.status(404).json({ error: 'Không tìm thấy cuộc trò chuyện' });
        }
        conversation.messages.push(newMessage._id);

        // Lưu lại thông tin cập nhật của nhóm
        await conversation.save();

        // Gửi phản hồi về cho client
        res.status(201).json({ message: 'Tin nhắn và tệp đã được gửi thành công' });
    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn và tệp đến nhóm:', error);
        res.status(500).json({ error: 'Lỗi khi gửi tin nhắn và tệp đến nhóm' });
    }
};

// lay 1 conversation de show thanh vien
const getConversationById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('conversationId: ', id);

        // Tìm cuộc trò chuyện theo ID và populate thông tin của các participants
        const conversation = await Conversation.findById({ _id: id });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        console.log('conversation: ', conversation);
        // Lấy danh sách ID người tham gia từ cuộc trò chuyện

        res.status(200).json(conversation);
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// thêm thành viên
const addParticipant = async (req, res) => {
    try {
        const { conversationId, userId } = req.body; // Lấy id của cuộc trò chuyện và id của người dùng từ body của request

        // Kiểm tra xem cuộc trò chuyện tồn tại không
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Cuộc trò chuyện không tồn tại' });
        }

        // Kiểm tra xem người dùng đã là thành viên của cuộc trò chuyện chưa
        if (conversation.participants.includes(userId)) {
            return res.status(400).json({ error: 'Người dùng đã là thành viên của cuộc trò chuyện' });
        }

        // Thêm userId vào mảng participants của cuộc trò chuyện
        conversation.participants.push(userId);

        // Lưu lại cuộc trò chuyện sau khi đã thêm thành viên
        await conversation.save();

        res.status(200).json({ message: 'Thêm thành viên thành công' });
    } catch (error) {
        console.error('Lỗi khi thêm thành viên vào cuộc trò chuyện:', error);
        res.status(500).json({ error: 'Lỗi khi thêm thành viên vào cuộc trò chuyện' });
    }
};
// remove thanh vien
const removeParticipant = async (req, res) => {
    try {
        const { conversationId, userId } = req.body; // Lấy id của cuộc trò chuyện và id của người dùng từ body của request

        // Kiểm tra xem cuộc trò chuyện tồn tại không
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Cuộc trò chuyện không tồn tại' });
        }

        // Kiểm tra xem người dùng có phải là thành viên của cuộc trò chuyện không
        if (!conversation.participants.includes(userId)) {
            return res.status(400).json({ error: 'Người dùng không phải là thành viên của cuộc trò chuyện' });
        }

        // Loại bỏ userId khỏi mảng participants của cuộc trò chuyện
        // đê != thay vì !== vì userId là String còn conversation.participants  là object Id => khác kiểu dữ liệu
        conversation.participants = conversation.participants.filter((participantId) => participantId != userId);
        // conversation.participants = conversation.participants.filter(participantId => console.log(participantId));
        // console.log(typeof userId)
        console.log(conversation.participants);
        // Lưu lại cuộc trò chuyện sau khi đã xóa thành viên
        await conversation.save();

        res.status(200).json({ message: 'Xóa thành viên thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa thành viên khỏi cuộc trò chuyện:', error);
        res.status(500).json({ error: 'Lỗi khi xóa thành viên khỏi cuộc trò chuyện' });
    }
};

// update
const updateConversation = async (req, res) => {
    try {
        const { conversationId } = req.params; // Lấy id của cuộc trò chuyện từ params của request
        const { idAdmin } = req.body; // Lấy dữ liệu cập nhật từ body của yêu cầu

        // Kiểm tra xem cuộc trò chuyện tồn tại không
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Cuộc trò chuyện không tồn tại' });
        }

        // Cập nhật thông tin cuộc trò chuyện
        if (idAdmin) {
            conversation.idAdmin = idAdmin;
        }
        // conversation.groupName = groupName;
        // conversation.participants = participants;

        // Lưu lại cuộc trò chuyện sau khi cập nhật
        await conversation.save();

        res.status(200).json({ message: 'Cập nhật cuộc trò chuyện thành công' });
    } catch (error) {
        console.error('Lỗi khi cập nhật cuộc trò chuyện:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật cuộc trò chuyện' });
    }
};

module.exports = {
    sendUploadFileToGroup,
    getAllConversationOfUser,
    createGroup,
    sendMessageToGroup,
    getGroupMessages,
    getConversationById,
    deleteConversation,
    addParticipant,
    removeParticipant,
    updateConversation,
};
