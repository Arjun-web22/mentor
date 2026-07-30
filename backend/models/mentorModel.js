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
 * Fetch all mentors with assigned students count
 * @returns {Promise<Array>} Array of mentor objects with assigned students count
 */
const getAllMentors = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        u.user_id,
        u.staff_id,
        u.full_name,
        u.designation,
        u.email,
        u.department_id,
        u.role,
        u.is_active,
        u.profile_photo,
        (SELECT COUNT(*) FROM student s WHERE s.staff_id = u.staff_id) AS assigned_students
       FROM users u
       WHERE u.role IN ('MENTOR', 'HOD')
       ORDER BY u.full_name ASC`
    );
    
    return rows;
  } catch (error) {
    throw new Error('Error fetching all mentors: ' + error.message);
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
  getAllMentors,
  fetchStudentsByMentor
};
