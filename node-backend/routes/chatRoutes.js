const express = require('express');
const { saveMessage, getChatHistory } = require('../controllers/chatController.js');
const verifyToken = require('../middleware/authMiddleware.js'); // You need to create this!

const router = express.Router();
router.post('/:repoId/save', verifyToken, saveMessage);
router.get('/:repoId/history', verifyToken, getChatHistory);
module.exports = router;