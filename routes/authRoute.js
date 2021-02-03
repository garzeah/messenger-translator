const express = require("express");
const router = new express.Router();

const authController = require("../controllers/authController");

// User register and login
router.post("/api/register", authController.register_post);
router.post("/api/login", authController.login_post);

module.exports = router;
