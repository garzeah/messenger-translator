const express = require("express");
const router = new express.Router();

const verifyToken = require("../middlewares/verifyToken");
const convoController = require("../controllers/convoController");

// Create a conversation
router.post(
	"/conversations/new/",
	verifyToken,
	convoController.newConversationPost
);

// Get all conversations for a user
router.get(
	"/conversations/",
	verifyToken,
	convoController.fetchAllConversationsGet
);

// Get a specific conversation
router.get("/conversations/:id", convoController.fetchConversationGet);

// Send message
router.post("/conversations/:id", convoController.sendMessagePost);

module.exports = router;
