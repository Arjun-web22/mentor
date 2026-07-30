const express = require('express');
const router = express.Router();
const { getDepartments, getMentorsByDepartment } = require('../controllers/departmentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/departments
 * @desc    Get all departments
 * @access  Public (for development)
 */
router.get('/', getDepartments);

/**
 * @route   GET /api/departments/:departmentId/mentors
 * @desc    Get all mentors in a department
 * @access  Public (for development)
 */
router.get('/:departmentId/mentors', getMentorsByDepartment);

module.exports = router;
