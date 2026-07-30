const { fetchMentor, getAllMentors, fetchStudentsByMentor } = require('../models/mentorModel');
const { getStudentsByStaffId } = require('../models/studentModel');
const { getDepartmentName } = require('../models/departmentModel');

/**
 * Get all mentors
 * @route GET /api/mentors
 */
const getAllMentorsController = async (req, res) => {
  try {
    const mentors = await getAllMentors();
    
    // Convert department_id to department_name
    const mentorsWithDepartmentName = mentors.map(mentor => ({
      ...mentor,
      department_name: getDepartmentName(mentor.department_id)
    }));
    
    res.status(200).json({
      success: true,
      count: mentorsWithDepartmentName.length,
      data: mentorsWithDepartmentName
    });
  } catch (error) {
    console.error("Error in getAllMentorsController:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get mentor by ID
 * @route GET /api/mentors/:mentorId
 */
const getMentorById = async (req, res) => {
  try {
    const { mentorId } = req.params;
    
    const mentor = await fetchMentor(mentorId);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: mentor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get students by mentor ID
 * @route GET /api/mentors/:mentorId/students
 */
const getStudentsByMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    console.log("getStudentsByMentor called with mentorId:", mentorId);
    
    // Use the real student model to fetch by staff_id
    const students = await getStudentsByStaffId(mentorId);
    console.log("Students found:", students.length);
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Error in getStudentsByMentor:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllMentorsController,
  getMentorById,
  getStudentsByMentor
};
