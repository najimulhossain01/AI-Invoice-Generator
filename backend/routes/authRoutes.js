const express = require("express");
const router = express.Router();
const { register, loginUser, getMe, updateProfile } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddlewares");

router.post("/register", register);
router.post("/login", loginUser);
router.route("/me").get(authMiddleware, getMe).put(authMiddleware, updateProfile);

module.exports = router;