const express = require("express");
const router = new express.Router();

const verifyToken = require("../middlewares/verifyToken");
const authController = require("../controllers/authController");

// User register and login
router.post("/api/register", authController.registerPost);
router.post("/api/login", authController.loginPost);
router.get("/api/logout", authController.logoutGet);
router.get("/api/checkUser", verifyToken, authController.checkUserGet);

module.exports = router;
