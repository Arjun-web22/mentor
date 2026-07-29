const { fetchMentor, fetchStudentsByMentor } = require('../models/mentorModel');
const { getStudentsByStaffId } = require('../models/studentModel');

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
  getMentorById,
  getStudentsByMentor
};
