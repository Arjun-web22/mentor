const { getStudentsByStaffId, getStudentByRegisterNo, updateStudent, getAllStudents } = require('../models/studentModel');

/**
 * Get students for a specific mentor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMentorStudents = async (req, res) => {
  try {
    const { staffId } = req.params;

    // Validate staffId
    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: 'Staff ID is required'
      });
    }

    // Get students from database
    const students = await getStudentsByStaffId(staffId);

    // Return success response
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Error in getMentorStudents controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get student by register number
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getStudent = async (req, res) => {
  try {
    const { registerNo } = req.params;

    // Validate registerNo
    if (!registerNo) {
      return res.status(400).json({
        success: false,
        message: 'Register number is required'
      });
    }

    // Get student from database
    const student = await getStudentByRegisterNo(registerNo);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Return success response
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error in getStudent controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update student information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateStudentInfo = async (req, res) => {
  try {
    const { registerNo } = req.params;
    const { student_name, year, section, staff_id } = req.body;

    // Validate registerNo
    if (!registerNo) {
      return res.status(400).json({
        success: false,
        message: 'Register number is required'
      });
    }

    // Validate required fields
    if (!student_name || !year || !section) {
      return res.status(400).json({
        success: false,
        message: 'Student name, year, and section are required'
      });
    }

    // Update student in database
    const updated = await updateStudent(registerNo, {
      student_name,
      year,
      section,
      staff_id: staff_id || null
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or update failed'
      });
    }

    // Get updated student data
    const student = await getStudentByRegisterNo(registerNo);

    // Return success response
    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Error in updateStudentInfo controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get all students
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllStudentsController = async (req, res) => {
  try {
    const students = await getAllStudents();

    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Error in getAllStudentsController:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getMentorStudents,
  getStudent,
  updateStudentInfo,
  getAllStudentsController
};
