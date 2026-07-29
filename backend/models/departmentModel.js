const pool = require('../config/db');

// Department Master Mapping
const DEPARTMENTS = {
  1: 'Civil Engineering',
  2: 'Computer Science and Engineering',
  3: 'Electronics and Communication Engineering',
  4: 'Electrical and Electronics Engineering',
  5: 'Information Technology',
  6: 'Mechanical Engineering',
  7: 'Artificial Intelligence and Data Science',
  8: 'Computer Science and Business Systems',
  9: 'Artificial Intelligence and Machine Learning',
  10: 'MBA',
  11: 'MCA',
  12: 'Science and Humanities'
};

/**
 * Fetch all departments
 * @returns {Promise<Array>} Array of department objects
 */
const fetchDepartments = async () => {
  try {
    const departments = Object.entries(DEPARTMENTS).map(([id, name]) => ({
      department_id: parseInt(id),
      department_name: name
    }));
    
    return departments;
  } catch (error) {
    throw new Error('Error fetching departments: ' + error.message);
  }
};

/**
 * Fetch mentors by department ID
 * @param {number} departmentId - Department ID
 * @returns {Promise<Array>} Array of mentor objects
 */
const fetchMentorsByDepartment = async (departmentId) => {
  try {
    const [rows] = await pool.query(
      `SELECT user_id, staff_id, full_name, designation, email, department_id 
       FROM users 
       WHERE department_id = ? 
       ORDER BY full_name`,
      [departmentId]
    );
    
    return rows;
  } catch (error) {
    throw new Error('Error fetching mentors by department: ' + error.message);
  }
};

/**
 * Get department name by ID
 * @param {number} departmentId - Department ID
 * @returns {string|null} Department name or null if not found
 */
const getDepartmentName = (departmentId) => {
  return DEPARTMENTS[departmentId] || null;
};

module.exports = {
  fetchDepartments,
  fetchMentorsByDepartment,
  getDepartmentName
};
