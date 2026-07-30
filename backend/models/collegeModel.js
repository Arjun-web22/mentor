const db = require('../config/db');

/**
 * Get all colleges
 * @returns {Promise<Array>} Array of colleges
 */
const getAllColleges = async () => {
  try {
    const [rows] = await db.query(
      `SELECT DISTINCT college_id 
       FROM users 
       WHERE college_id IS NOT NULL`
    );
    
    // Map college IDs to college details
    const colleges = rows.map(row => {
      if (row.college_id === 1) {
        return {
          college_id: 1,
          college_name: 'Francis Xavier Engineering College',
          college_code: 'FXEC',
          location: 'Tirunelveli, Tamil Nadu'
        };
      }
      return {
        college_id: row.college_id,
        college_name: `College ${row.college_id}`,
        college_code: `COL${row.college_id}`,
        location: 'Location TBD'
      };
    });
    
    return colleges;
  } catch (error) {
    console.error('Error in getAllColleges model:', error);
    throw error;
  }
};

/**
 * Get college statistics
 * @param {number} collegeId - College ID
 * @returns {Promise<Object>} College statistics
 */
const getCollegeStats = async (collegeId) => {
  try {
    const [deptRows] = await db.query(
      `SELECT COUNT(DISTINCT department_id) as department_count 
       FROM users 
       WHERE college_id = ?`,
      [collegeId]
    );
    
    const [studentRows] = await db.query(
      `SELECT COUNT(*) as student_count 
       FROM student 
       WHERE college_id = ?`,
      [collegeId]
    );
    
    const [mentorRows] = await db.query(
      `SELECT COUNT(*) as mentor_count 
       FROM users 
       WHERE college_id = ? AND role = 'MENTOR'`,
      [collegeId]
    );
    
    return {
      department_count: deptRows[0].department_count || 0,
      student_count: studentRows[0].student_count || 0,
      mentor_count: mentorRows[0].mentor_count || 0
    };
  } catch (error) {
    console.error('Error in getCollegeStats model:', error);
    throw error;
  }
};

module.exports = {
  getAllColleges,
  getCollegeStats
};
