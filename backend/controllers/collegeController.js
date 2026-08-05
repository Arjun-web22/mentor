const { getAllColleges, getCollegeStats } = require('../models/collegeModel');

/**
 * Get all colleges with statistics
 * @route GET /api/colleges
 */
const getAllCollegesController = async (req, res) => {
  try {
    console.log("========== BACKEND COLLEGE CONTROLLER ==========");
    const colleges = await getAllColleges();
    console.log("Colleges from model:", colleges);

    // Add statistics to each college
    const collegesWithStats = await Promise.all(
      colleges.map(async (college) => {
        const stats = await getCollegeStats(college.college_id);
        console.log(`Stats for college ${college.college_id}:`, stats);
        return {
          ...college,
          ...stats
        };
      })
    );

    console.log("Final collegesWithStats:", collegesWithStats);

    const response = {
      success: true,
      count: collegesWithStats.length,
      data: collegesWithStats
    };
    console.log("FINAL JSON RESPONSE TO BE SENT:", JSON.stringify(response, null, 2));

    res.json(response);
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
