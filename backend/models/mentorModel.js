const pool = require('../config/db');

/**
 * Fetch mentor by ID
 * @param {number} mentorId - Mentor user ID
 * @returns {Promise<Object|null>} Mentor object or null if not found
 */
const fetchMentor = async (mentorId) => {
  try {
    const [rows] = await pool.query(
      `SELECT user_id, staff_id, full_name, designation, email, department_id 
       FROM users 
       WHERE user_id = ?`,
      [mentorId]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0];
  } catch (error) {
    throw new Error('Error fetching mentor: ' + error.message);
  }
};

/**
 * Fetch students by mentor ID (placeholder for future implementation)
 * @param {number} mentorId - Mentor user ID
 * @returns {Promise<Object>} Placeholder response
 */
const fetchStudentsByMentor = async (mentorId) => {
  try {
    // Placeholder - will be implemented when students table is added
    return {
      message: 'Students not yet added.'
    };
  } catch (error) {
    throw new Error('Error fetching students by mentor: ' + error.message);
  }
};

module.exports = {
  fetchMentor,
  fetchStudentsByMentor
};
