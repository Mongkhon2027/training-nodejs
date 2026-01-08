const express = require('express');
const router = express.Router();
const userController = require("../../controllers/v1/user");
const authMiddleware = require("../../middleware/auth");

// [POST] - User login
router.post('/login', userController.login)

// [POST] - User register
router.post('/register', userController.registerUser)

// [PUT] - Approve user (admin)
router.put('/:id/approve', authMiddleware, userController.approveUser);
module.exports = router;
