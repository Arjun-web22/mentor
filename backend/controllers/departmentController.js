const { fetchDepartments, fetchMentorsByDepartment, getDepartmentName } = require('../models/departmentModel');

/**
 * Get all departments
 * @route GET /api/departments
 */
const getDepartments = async (req, res) => {
  try {
    const departments = await fetchDepartments();
    
    res.status(200).json({
      success: true,
      data: departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get mentors by department ID
 * @route GET /api/departments/:departmentId/mentors
 */
const getMentorsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    
    // Validate department ID
    const departmentName = getDepartmentName(parseInt(departmentId));
    if (!departmentName) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    const mentors = await fetchMentorsByDepartment(departmentId);
    
    res.status(200).json({
      success: true,
      data: mentors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDepartments,
  getMentorsByDepartment
};
