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
    
    // Role-based filtering
    let filteredMentors = mentors;
    if (req.user.role === 'HOD') {
      // HOD only sees mentors in their department
      filteredMentors = mentors.filter(mentor => mentor.department_id === req.user.department_id);
    }
    // SUPER_ADMIN sees all mentors
    
    // Convert department_id to department_name
    const mentorsWithDepartmentName = await Promise.all(
      filteredMentors.map(async mentor => ({
        ...mentor,
        department_name: await getDepartmentName(mentor.department_id)
      }))
    );
    
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
    
    // Role-based access control
    if (req.user.role === 'MENTOR') {
      // MENTOR can only view their own profile
      if (mentorId !== req.user.staff_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own profile.'
        });
      }
    } else if (req.user.role === 'HOD') {
      // HOD can only view mentors in their department
      const mentor = await fetchMentor(mentorId);
      if (!mentor || mentor.department_id !== req.user.department_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view mentors in your department.'
        });
      }
    }
    // SUPER_ADMIN can view any mentor
    
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
    
    console.log("========== AUTH DEBUG ==========");
    console.log("JWT:", req.user);
    console.log("Requested mentorId:", mentorId);
    
    // Role-based access control
    if (req.user.role === 'MENTOR') {
      console.log("MENTOR Authorization Check");
      console.log("Expected (JWT staff_id):", req.user.staff_id);
      console.log("Actual (requested mentorId):", mentorId);
      console.log("Comparison result:", req.user.staff_id === mentorId);
      
      if (mentorId !== req.user.staff_id) {
        console.log("403 REASON: Mentor staff_id mismatch");
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own students.'
        });
      }
      console.log("Authorization PASSED");
    } else if (req.user.role === 'HOD') {
      console.log("HOD Authorization Check");
      const mentor = await fetchMentor(mentorId);
      console.log("Mentor DB Result:", mentor);
      
      if (!mentor) {
        console.log("403 REASON: Mentor not found");
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view students in your department.'
        });
      }
      
      console.log("mentor.department_id:", mentor.department_id);
      console.log("req.user.department_id:", req.user.department_id);
      console.log("Comparison result:", mentor.department_id === req.user.department_id);
      
      if (mentor.department_id !== req.user.department_id) {
        console.log("403 REASON: Mentor belongs to different department");
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view students in your department.'
        });
      }
      console.log("Authorization PASSED");
    } else if (req.user.role === 'SUPER_ADMIN') {
      console.log("SUPER_ADMIN BYPASS - No checks required");
      console.log("Authorization PASSED");
    } else {
      console.log("403 REASON: Invalid role");
      return res.status(403).json({
        success: false,
        message: 'Access denied. Unknown role.'
      });
    }
    
    // Use the real student model to fetch by staff_id
    const students = await getStudentsByStaffId(mentorId);
    console.log("Students DB Result count:", students.length);
    
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
