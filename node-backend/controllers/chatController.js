const ChatHistory = require('../models/chat.js');
// Save a new message
const saveMessage = async (req, res) => {
  try {
    const { repoId, userQuery, botAnswer, referencedFiles } = req.body;

    // Assumes middleware attaches user info (req.user)
    const newMessage = await ChatHistory.create({
      userId: req.user.id,
      repoId,
      userQuery,
      botAnswer,
      referencedFiles
    });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get chat history for a user
const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const repoId = req.repoId;
    const chats = await ChatHistory.find({ userId, repoId }).sort({ createdAt: 1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { saveMessage, getChatHistory };