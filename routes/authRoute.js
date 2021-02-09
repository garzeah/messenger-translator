const express = require("express");
const router = new express.Router();

const authController = require("../controllers/authController");

// User register and login
router.post("/api/register", authController.registerPost);
router.post("/api/login", authController.loginPost);
router.get("/api/logout", authController.logoutGet);

module.exports = router;
