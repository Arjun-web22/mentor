const db = require('../config/db');

/**
 * Get students by mentor staff_id
 * @param {string} staffId - Mentor staff_id
 * @returns {Promise<Array>} Array of students
 */
const getStudentsByStaffId = async (staffId) => {
  try {
    console.log("Requested staff_id:", staffId);
    const [rows] = await db.query(
      `SELECT 
        course_degree,
        year,
        section,
        register_no,
        roll_no,
        student_name,
        staff_id,
        staff_name
      FROM student 
      WHERE staff_id = ?`,
      [staffId]
    );
    console.log("SQL result length:", rows.length);
    return rows;
  } catch (error) {
    console.error('Error in getStudentsByStaffId model:', error);
    throw error;
  }
};

/**
 * Get student by register number
 * @param {string} registerNo - Student register number
 * @returns {Promise<Object|null>} Student object or null
 */
const getStudentByRegisterNo = async (registerNo) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        course_degree,
        year,
        section,
        register_no,
        roll_no,
        student_name,
        staff_id,
        staff_name
      FROM student 
      WHERE register_no = ?`,
      [registerNo]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error('Error in getStudentByRegisterNo model:', error);
    throw error;
  }
};

/**
 * Update student information
 * @param {string} registerNo - Student register number
 * @param {Object} updateData - Data to update
 * @returns {Promise<boolean>} True if updated successfully
 */
const updateStudent = async (registerNo, updateData) => {
  try {
    const { student_name, year, section, staff_id } = updateData;
    
    const [result] = await db.query(
      `UPDATE student 
      SET student_name = ?, year = ?, section = ?, staff_id = ?
      WHERE register_no = ?`,
      [student_name, year, section, staff_id, registerNo]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error in updateStudent model:', error);
    throw error;
  }
};

/**
 * Get all students
 * @returns {Promise<Array>} Array of all students
 */
const getAllStudents = async () => {
  try {
    const [rows] = await db.query(
      `SELECT 
        course_degree,
        year,
        section,
        register_no,
        roll_no,
        student_name,
        staff_id,
        staff_name
      FROM student`
    );
    return rows;
  } catch (error) {
    console.error('Error in getAllStudents model:', error);
    throw error;
  }
};

/**
 * Count students by staff ID (mentor)
 * @param {string} staffId - Staff ID
 * @returns {Promise<number>} Count of students
 */
const countStudentsByStaffId = async (staffId) => {
  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) as count FROM student WHERE staff_id = ?`,
      [staffId]
    );
    return rows[0].count;
  } catch (error) {
    console.error('Error in countStudentsByStaffId model:', error);
    throw error;
  }
};

module.exports = {
  getStudentsByStaffId,
  getStudentByRegisterNo,
  updateStudent,
  getAllStudents,
  countStudentsByStaffId
};
