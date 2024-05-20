const express = require('express');
const router = express.Router();
const multer = require('multer');
const chatController = require('../controllers/chat');
const authenticateToken = require('../middleware/auth')

router.post('/chat/:userID', authenticateToken, chatController.initiateChat);
router.post('/chat/:userID/message', authenticateToken, chatController.sendMessage);
router.get('/chat/:userID/history', authenticateToken, chatController.getChatHistory);

module.exports = router;
