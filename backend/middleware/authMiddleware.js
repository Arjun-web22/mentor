/**
 * Authentication middleware to protect routes
 * Verifies JWT token and attaches user to request object
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authentication required.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log("Extracted Token:", token ? 'Present' : 'Missing');

    // Verify JWT token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    
    console.log("Decoded JWT:", decoded);

    // Attach user info from token to request
    // Support both staff (userId) and student (register_no) payloads
    req.user = {
      userId: decoded.userId || null,
      register_no: decoded.register_no || null,
      staff_id: decoded.staff_id,
      college_id: decoded.college_id,
      department_id: decoded.department_id || null,
      email: decoded.email,
      role: decoded.role
    };

    console.log("req.user set:", req.user);

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

/**
 * Role-based authorization middleware
 * Checks if user has required role
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Get user from request (set by authenticate middleware)
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.'
        });
      }

      // Check if user has required role
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions.'
        });
      }

      next();
    } catch (error) {
      console.error('Authorization middleware error:', error);
      return res.status(403).json({
        success: false,
        message: 'Authorization failed.'
      });
    }
  };
};

module.exports = {
  authenticate,
  authorize
};
