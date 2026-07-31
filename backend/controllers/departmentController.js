const { fetchDepartments, fetchMentorsByDepartment, getDepartmentName, getDepartmentAnalytics, getMentorAnalyticsByDepartment } = require('../models/departmentModel');

// Rename model function to avoid naming conflict with controller function
const fetchMentorsByDepartmentModel = fetchMentorsByDepartment;

/**
 * Get all departments with statistics
 * @route GET /api/departments
 */
const getDepartments = async (req, res) => {
  try {
    const { collegeId } = req.query;
    
    console.log("getDepartments - collegeId:", collegeId);
    console.log("getDepartments - req.user:", req.user);
    
    // Default to user's college_id if no collegeId provided
    const effectiveCollegeId = collegeId ? parseInt(collegeId) : req.user.college_id;
    
    // College permission validation
    if (collegeId && req.user.role !== 'SUPER_ADMIN') {
      // Non-SUPER_ADMIN users can only access their own college
      if (parseInt(collegeId) !== req.user.college_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own college data.'
        });
      }
    }
    // If no collegeId provided, backend infers from req.user.college_id (line 18)
    
    const departments = await fetchDepartments(effectiveCollegeId);
    const analytics = await getDepartmentAnalytics(effectiveCollegeId);
    
    console.log("Departments from fetchDepartments:", departments);
    console.log("Analytics from getDepartmentAnalytics:", analytics);
    
    // Merge analytics with department data
    const departmentsWithStats = departments.map(dept => {
      const deptAnalytics = analytics.find(a => a.department_id === dept.department_id) || {
        student_count: 0,
        mentor_count: 0,
        avg_cgpa: 0,
        avg_attendance: 0
      };
      
      return {
        ...dept,
        student_count: deptAnalytics.student_count,
        mentor_count: deptAnalytics.mentor_count,
        avg_cgpa: deptAnalytics.avg_cgpa,
        avg_attendance: deptAnalytics.avg_attendance
      };
    });
    
    console.log("API Response departmentsWithStats:", departmentsWithStats);
    
    // Role-based filtering
    let filteredDepartments = departmentsWithStats;
    if (req.user.role === 'HOD' || req.user.role === 'MENTOR') {
      // HOD and MENTOR only see their own department
      filteredDepartments = departmentsWithStats.filter(dept => dept.department_id === req.user.department_id);
    }
    // SUPER_ADMIN sees all departments in their college
    
    res.status(200).json({
      success: true,
      data: filteredDepartments
    });
  } catch (error) {
    console.error("getDepartments - Error:", error);
    console.error("getDepartments - Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
};

/**
 * Get mentors by department ID
 * @route GET /api/departments/:departmentId/mentors
 */
const getMentorsByDepartmentController = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { collegeId } = req.query;
    
    // Role-based access control
    if (req.user.role === 'HOD' || req.user.role === 'MENTOR') {
      // HOD and MENTOR can only access their own department
      if (parseInt(departmentId) !== req.user.department_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view your own department.'
        });
      }
    }
    // SUPER_ADMIN can access any department
    
    const mentors = await fetchMentorsByDepartmentModel(departmentId, collegeId ? parseInt(collegeId) : null);
    
    // Add department_name to each mentor
    const mentorsWithDepartmentName = await Promise.all(
      mentors.map(async mentor => ({
        ...mentor,
        department_name: await getDepartmentName(mentor.department_id)
      }))
    );
    
    res.status(200).json({
      success: true,
      data: mentorsWithDepartmentName
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
  getMentorsByDepartment: getMentorsByDepartmentController
};
