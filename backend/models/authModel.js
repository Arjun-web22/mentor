const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Hash the temporary admin password
const TEMP_ADMIN_PASSWORD_HASH = bcrypt.hashSync('admin123', 10);

// Hash the temporary HOD password
const TEMP_HOD_PASSWORD_HASH = bcrypt.hashSync('hod123', 10);

// Temporary super admin credentials (will be replaced with database records)
const TEMP_ADMIN = {
  email: 'admin@fxec.edu.in',
  password: TEMP_ADMIN_PASSWORD_HASH,
  role: 'SUPER_ADMIN',
  user_id: 'admin-001',
  full_name: 'Dr. S. Raja',
  designation: 'Principal',
  department_id: 'ADMIN',
  college_id: 1,
  profile_photo: null
};

// Temporary HOD credentials (will be replaced with database records)
const TEMP_HOD = {
  email: 'hod@fxec.edu.in',
  password: TEMP_HOD_PASSWORD_HASH,
  role: 'HOD',
  user_id: 'hod-001',
  full_name: 'Dr. K. Suresh',
  designation: 'Head of Department',
  department_id: 5, // Information Technology
  college_id: 1,
  profile_photo: null
};

/**
 * Authenticate user by email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object|null>} User object if authenticated, null otherwise
 */
const login = async (email, password) => {
  try {
    // Check for temporary super admin
    if (email === TEMP_ADMIN.email) {
      const isMatch = await bcrypt.compare(password, TEMP_ADMIN.password);
      if (isMatch) {
        return TEMP_ADMIN;
      }
      return null;
    }

    // Check for temporary HOD
    if (email === TEMP_HOD.email) {
      const isMatch = await bcrypt.compare(password, TEMP_HOD.password);
      if (isMatch) {
        return TEMP_HOD;
      }
      return null;
    }

    // Query database for user
    const [rows] = await db.query(
      'SELECT user_id, college_id, staff_id, full_name, designation, email, department_id, password, role, profile_photo FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    // Remove password from response
    delete user.password;

    return user;
  } catch (error) {
    console.error('Error in login model:', error);
    throw error;
  }
};

/**
 * Find user by email (for Google OAuth)
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object if found, null otherwise
 */
const findUserByEmail = async (email) => {
  try {
    // Query database for user
    const [rows] = await db.query(
      'SELECT user_id, college_id, staff_id, full_name, designation, email, department_id, role, profile_photo FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error('Error in findUserByEmail model:', error);
    throw error;
  }
};

module.exports = {
  login,
  findUserByEmail
};
