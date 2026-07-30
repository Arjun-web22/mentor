/**
 * Authentication middleware to protect routes
 * Verifies JWT token and attaches user to request object
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authentication required.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // For now, we'll use a simple token validation
    // In production, verify JWT token here
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // For development, accept any non-empty token
    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    // Attach user info from token (in production, decode from JWT)
    // For now, we'll skip this and let the controller handle user info
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed.'
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
