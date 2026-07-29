const { fetchMentor, fetchStudentsByMentor } = require('../models/mentorModel');

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
 * Get students by mentor ID (placeholder)
 * @route GET /api/mentors/:mentorId/students
 */
const getStudentsByMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    
    // Placeholder - will be implemented when students table is added
    const result = await fetchStudentsByMentor(mentorId);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
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
