const db = require('../config/db');

/**
 * Get all colleges
 * @returns {Promise<Array>} Array of colleges
 */
const getAllColleges = async () => {
  try {
    console.log("========== BACKEND MODEL getAllColleges ==========");
    const [rows] = await db.query(
      `SELECT college_id, college_code, college_name, location 
       FROM colleges 
       ORDER BY college_name`
    );
    
    console.log("SQL Result from colleges table:", rows);
    
    const mapped = rows.map(row => ({
      college_id: row.college_id,
      college_code: row.college_code,
      college_name: row.college_name,
      location: row.location || 'Location TBD'
    }));
    
    console.log("Mapped colleges result:", mapped);
    return mapped;
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
    console.log(`========== BACKEND MODEL getCollegeStats for college_id ${collegeId} ==========`);

    const [deptRows] = await db.query(
      `SELECT COUNT(*) as department_count 
       FROM departments 
       WHERE college_id = ?`,
      [collegeId]
    );
    console.log("Department count SQL result:", deptRows[0]);

    const [studentRows] = await db.query(
      `SELECT COUNT(*) as student_count 
       FROM student 
       WHERE college_id = ?`,
      [collegeId]
    );
    console.log("Student count SQL result:", studentRows[0]);

    const [mentorRows] = await db.query(
      `SELECT COUNT(*) as mentor_count 
       FROM users 
       WHERE college_id = ? AND role IN ('MENTOR', 'HOD')`,
      [collegeId]
    );
    console.log("Mentor count SQL result:", mentorRows[0]);

    const stats = {
      department_count: deptRows[0].department_count || 0,
      student_count: studentRows[0].student_count || 0,
      mentor_count: mentorRows[0].mentor_count || 0
    };
    console.log("Final stats for college:", stats);
    return stats;
  } catch (error) {
    console.error('Error in getCollegeStats model:', error);
    throw error;
  }
};

module.exports = {
  getAllColleges,
  getCollegeStats
};
