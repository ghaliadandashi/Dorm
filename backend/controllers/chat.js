const User = require('../models/User');
const Chat = require('../models/Chat')

exports.initiateChat = async (req, res) => {
    try {
        const { userID } = req.params;
        const currentUserID = req.user.id;

        // Check if both users exist
        const user1 = await User.findById(currentUserID);
        const user2 = await User.findById(userID);

        if (!user1 || !user2) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Chat can be initiated' });
    } catch (error) {
        console.error('Failed to initiate chat:', error);
        res.status(500).send('Error initiating chat');
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { userID } = req.params;
        const { content } = req.body;
        const senderID = req.user.id;

        if (!content) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        const newMessage = new Chat({
            content,
            sender: senderID,
            receiver: userID
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Failed to send message:', error);
        res.status(500).send('Error sending message');
    }
};

exports.getChatHistory = async (req, res) => {
    try {
        const { userID } = req.params;
        const currentUserID = req.user.id;

        const chatHistory = await Chat.find({
            $or: [
                { sender: currentUserID, receiver: userID },
                { sender: userID, receiver: currentUserID }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json(chatHistory);
    } catch (error) {
        console.error('Failed to retrieve chat history:', error);
        res.status(500).send('Error retrieving chat history');
    }
};