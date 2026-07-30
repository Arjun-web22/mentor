const { getAllColleges, getCollegeStats } = require('../models/collegeModel');

/**
 * Get all colleges with statistics
 * @route GET /api/colleges
 */
const getAllCollegesController = async (req, res) => {
  try {
    const colleges = await getAllColleges();
    
    // Add statistics to each college
    const collegesWithStats = await Promise.all(
      colleges.map(async (college) => {
        const stats = await getCollegeStats(college.college_id);
        return {
          ...college,
          ...stats
        };
      })
    );
    
    res.json({
      success: true,
      count: collegesWithStats.length,
      data: collegesWithStats
    });
  } catch (error) {
    console.error('Error in getAllCollegesController:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllCollegesController
};
