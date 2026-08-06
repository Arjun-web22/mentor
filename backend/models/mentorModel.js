const pool = require('../config/db');

/**
 * Fetch mentor by staff_id with full details
 * @param {string} staffId - Mentor staff ID
 * @returns {Promise<Object|null>} Mentor object or null if not found
 */
const fetchMentor = async (staffId) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        u.user_id,
        u.staff_id,
        u.full_name,
        u.designation,
        u.email,
        u.phone,
        u.department_id,
        u.college_id,
        u.role,
        u.is_active,
        u.profile_photo,
        d.department_name,
        c.college_name,
        (SELECT COUNT(*) FROM student s WHERE s.staff_id = u.staff_id) AS total_students,
        (SELECT AVG(s.cgpa) FROM student s WHERE s.staff_id = u.staff_id) AS avg_cgpa,
        (SELECT AVG(s.attendance) FROM student s WHERE s.staff_id = u.staff_id) AS avg_attendance
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.department_id
       LEFT JOIN colleges c ON u.college_id = c.college_id
       WHERE u.staff_id = ?`,
      [staffId]
    );

    if (rows.length === 0) {
      return null;
    }

    const mentor = rows[0];
    return {
      ...mentor,
      employee_code: mentor.staff_id,
      is_active: mentor.is_active === 1 || mentor.is_active === true
    };
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
