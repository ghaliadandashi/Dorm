const express = require('express');
const router = express.Router();
const multer = require('multer');
const {initiateChat,sendMessage,getChatHistory, getMessages,chat, getChat} = require('../controllers/chat')
const authenticateToken = require('../middleware/auth')

router.post('/initiateChat/:userID', authenticateToken,initiateChat);
router.post('/sendMessage/:userID/message', authenticateToken, sendMessage);
router.get('/getChatHistory', authenticateToken, getChatHistory);
router.get('/getMessages',authenticateToken,getMessages)
router.post('/chat',authenticateToken,chat)
router.get('/getChat/:sender/:receiver',authenticateToken,getChat)
module.exports = router;
