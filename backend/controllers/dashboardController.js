const { getSuperAdminDashboardData, getHODDashboardData } = require('../models/dashboardModel');
const { getDepartmentName } = require('../models/departmentModel');

/**
 * Get super admin dashboard data
 * @route GET /api/dashboard/super-admin
 */
const getSuperAdminDashboard = async (req, res) => {
  try {
    const dashboardData = await getSuperAdminDashboardData();
    
    // Add department names to all charts and convert numeric values
    const cgpaChartWithNames = await Promise.all(
      dashboardData.cgpaChart.map(async item => ({
        ...item,
        department_name: await getDepartmentName(item.department_id),
        avg_cgpa: Number(item.avg_cgpa || 0)
      }))
    );
    
    const attendanceChartWithNames = await Promise.all(
      dashboardData.attendanceChart.map(async item => ({
        ...item,
        department_name: await getDepartmentName(item.department_id),
        avg_attendance: Number(item.avg_attendance || 0)
      }))
    );
    
    const studentDistributionWithNames = await Promise.all(
      dashboardData.studentDistribution.map(async item => ({
        ...item,
        department_name: await getDepartmentName(item.department_id),
        total_students: Number(item.total_students || 0)
      }))
    );
    
    const mentorDistributionWithNames = await Promise.all(
      dashboardData.mentorDistribution.map(async item => ({
        ...item,
        department_name: await getDepartmentName(item.department_id),
        total_mentors: Number(item.total_mentors || 0)
      }))
    );
    
    const topMentorsWithNumbers = dashboardData.topMentors.map(mentor => ({
      ...mentor,
      avg_cgpa: Number(mentor.avg_cgpa || 0),
      total_students: Number(mentor.total_students || 0)
    }));
    
    res.status(200).json({
      success: true,
      data: {
        summary: dashboardData.summary,
        cgpaChart: cgpaChartWithNames,
        attendanceChart: attendanceChartWithNames,
        studentDistribution: studentDistributionWithNames,
        mentorDistribution: mentorDistributionWithNames,
        arrearChart: dashboardData.arrearChart,
        topMentors: topMentorsWithNumbers,
        statistics: dashboardData.statistics
      }
    });
  } catch (error) {
    console.error('Error in getSuperAdminDashboard:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get HOD dashboard data
 * @route GET /api/dashboard/hod
 */
const getHODDashboard = async (req, res) => {
  try {
    const { department_id, college_id } = req.user;
    
    const dashboardData = await getHODDashboardData(department_id, college_id);
    
    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error in getHODDashboard:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getSuperAdminDashboard,
  getHODDashboard
};
