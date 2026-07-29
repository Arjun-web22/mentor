const express = require('express');
const router = express.Router();
const { getDepartments, getMentorsByDepartment } = require('../controllers/departmentController');

/**
 * @route   GET /api/departments
 * @desc    Get all departments
 * @access  Public
 */
router.get('/', getDepartments);

/**
 * @route   GET /api/departments/:departmentId/mentors
 * @desc    Get all mentors in a department
 * @access  Public
 */
router.get('/:departmentId/mentors', getMentorsByDepartment);

module.exports = router;
