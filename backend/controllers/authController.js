const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { login, findUserByEmail } = require('../models/authModel');

/**
 * Handle user login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Authenticate user
    const user = await login(email, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.user_id,
        staff_id: user.staff_id,
        college_id: user.college_id,
        department_id: user.department_id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '24h' }
    );

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        college_id: user.college_id,
        staff_id: user.staff_id,
        full_name: user.full_name,
        designation: user.designation,
        email: user.email,
        department_id: user.department_id,
        role: user.role,
        profile_photo: user.profile_photo
      }
    });
  } catch (error) {
    console.error('Error in login controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Handle Google Sign-In login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    // Validate input
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Initialize Google OAuth client
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user exists in database
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this ERP.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.user_id,
        staff_id: user.staff_id,
        college_id: user.college_id,
        department_id: user.department_id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '24h' }
    );

    // Return success response
    res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: {
        user_id: user.user_id,
        college_id: user.college_id,
        staff_id: user.staff_id,
        full_name: user.full_name,
        designation: user.designation,
        email: user.email,
        department_id: user.department_id,
        role: user.role,
        profile_photo: user.profile_photo || picture
      }
    });
  } catch (error) {
    console.error('Error in Google login controller:', error);
    if (error.message.includes('Token used too late') || error.message.includes('Invalid token signature')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Google credential'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  loginUser,
  googleLogin
};
