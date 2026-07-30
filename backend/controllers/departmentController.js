const { fetchDepartments, fetchMentorsByDepartment, getDepartmentName, countStudentsByDepartment, countMentorsByDepartment } = require('../models/departmentModel');
const { countStudentsByStaffId } = require('../models/studentModel');

/**
 * Get all departments with statistics
 * @route GET /api/departments
 */
const getDepartments = async (req, res) => {
  try {
    const departments = await fetchDepartments();
    
    // Add statistics to each department
    const departmentsWithStats = await Promise.all(
      departments.map(async (dept) => {
        const [studentCount, mentorCount] = await Promise.all([
          countStudentsByDepartment(dept.department_id),
          countMentorsByDepartment(dept.department_id)
        ]);
        
        return {
          ...dept,
          student_count: studentCount,
          mentor_count: mentorCount
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: departmentsWithStats
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
    
    // Add student count to each mentor
    const mentorsWithCount = await Promise.all(
      mentors.map(async (mentor) => {
        const studentCount = await countStudentsByStaffId(mentor.staff_id);
        return {
          ...mentor,
          student_count: studentCount
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: mentorsWithCount
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
