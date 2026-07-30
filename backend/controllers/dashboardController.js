const { getSuperAdminDashboardData } = require('../models/dashboardModel');
const { getDepartmentName } = require('../models/departmentModel');

/**
 * Get super admin dashboard data
 * @route GET /api/dashboard/super-admin
 */
const getSuperAdminDashboard = async (req, res) => {
  try {
    const dashboardData = await getSuperAdminDashboardData();
    
    // Add department names to CGPA chart
    const cgpaChartWithNames = dashboardData.cgpaChart.map(item => ({
      ...item,
      department_name: getDepartmentName(item.department_id)
    }));
    
    res.status(200).json({
      success: true,
      data: {
        summary: dashboardData.summary,
        cgpaChart: cgpaChartWithNames,
        arrearChart: dashboardData.arrearChart
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

module.exports = {
  getSuperAdminDashboard
};
