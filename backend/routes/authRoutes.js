const express = require('express');
const router = express.Router();
const { loginUser, googleLogin } = require('../controllers/authController');

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user with email/password and return JWT token
 * @access  Public
 */
router.post('/login', loginUser);

/**
 * @route   POST /api/auth/google
 * @desc    Authenticate user with Google OAuth and return JWT token
 * @access  Public
 */
router.post('/google', googleLogin);

module.exports = router;
