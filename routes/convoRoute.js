const express = require("express");
const router = new express.Router();

const verifyToken = require("../middlewares/verifyToken");
const convoController = require("../controllers/convoController");

// Create a conversation
router.post(
	"/api/conversations/new",
	verifyToken,
	convoController.newConversationPost
);

// Get all conversations for a user
router.get(
	"/api/conversations/me",
	verifyToken,
	convoController.fetchAllMyConversationsGet
);

// Get a specific conversation and its messages
router.get(
	"/api/conversations",
	verifyToken,
	convoController.fetchConversationGet
);

// Send message
router.post(
	"/api/conversations/:id",
	verifyToken,
	convoController.sendMessagePost
);

module.exports = router;
