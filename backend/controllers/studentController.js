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

    // Role-based access control
    if (req.user.role === 'MENTOR') {
      // MENTOR can only view their own students
      if (staffId !== req.user.staff_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own students.'
        });
      }
    } else if (req.user.role === 'HOD') {
      // HOD can only view students of mentors in their department
      // Need to verify the mentor belongs to HOD's department
      const { fetchMentor } = require('../models/mentorModel');
      const mentor = await fetchMentor(staffId);
      if (!mentor || mentor.department_id !== req.user.department_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view students in your department.'
        });
      }
    }
    // SUPER_ADMIN can view any mentor's students

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

    // Role-based access control
    if (req.user.role === 'STUDENT') {
      if (registerNo !== req.user.register_no) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own information.'
        });
      }
    } else if (req.user.role === 'MENTOR') {
      if (student.staff_id !== req.user.staff_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own students.'
        });
      }
    } else if (req.user.role === 'HOD') {
      const { fetchMentor } = require('../models/mentorModel');
      const mentor = await fetchMentor(student.staff_id);
      
      if (!mentor) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view students in your department.'
        });
      }
      
      if (mentor.department_id !== req.user.department_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view students in your department.'
        });
      }
    } else if (req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Unknown role.'
      });
    }

    // Return success response
    console.log("FINAL RESPONSE SENT TO CLIENT:");
    console.dir(student, { depth: null });
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

    // Get student from database for RBAC checks
    const student = await getStudentByRegisterNo(registerNo);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Role-based access control
    if (req.user.role === 'MENTOR') {
      // MENTOR can only update their assigned students
      if (student.staff_id !== req.user.staff_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update your own students.'
        });
      }
    } else if (req.user.role === 'HOD') {
      // HOD can only update students in their department
      const { fetchMentor } = require('../models/mentorModel');
      const mentor = await fetchMentor(student.staff_id);
      
      if (!mentor || mentor.department_id !== req.user.department_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update students in your department.'
        });
      }
    }
    // SUPER_ADMIN can update any student

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
    const updatedStudent = await getStudentByRegisterNo(registerNo);

    // Return success response
    res.json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
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
    const { departmentId } = req.query;
    
    // Get students from database with optional department filter
    const students = await getAllStudents(departmentId ? parseInt(departmentId) : null);

    // Role-based filtering
    let filteredStudents = students;
    if (req.user.role === 'MENTOR') {
      // MENTOR only sees their own students
      filteredStudents = students.filter(student => student.staff_id === req.user.staff_id);
    } else if (req.user.role === 'HOD') {
      // HOD only sees students in their department
      // Need to get all mentors in HOD's department, then filter students by those mentors
      const { getAllMentors } = require('../models/mentorModel');
      const mentors = await getAllMentors();
      const departmentMentors = mentors
        .filter(mentor => mentor.department_id === req.user.department_id)
        .map(mentor => mentor.staff_id);
      filteredStudents = students.filter(student => departmentMentors.includes(student.staff_id));
    }
    // SUPER_ADMIN sees all students (or filtered by departmentId if provided)

    res.json({
      success: true,
      count: filteredStudents.length,
      data: filteredStudents
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
