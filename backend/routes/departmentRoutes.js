const express = require('express');
const router = express.Router();
const { getDepartments, getMentorsByDepartment } = require('../controllers/departmentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/departments
 * @desc    Get all departments (SUPER_ADMIN sees all, HOD/MENTOR see their department)
 * @access  SUPER_ADMIN, HOD, MENTOR
 */
router.get('/', authenticate, authorize('SUPER_ADMIN', 'HOD', 'MENTOR'), getDepartments);

/**
 * @route   GET /api/departments/:departmentId/mentors
 * @desc    Get all mentors in a department (HOD sees their department, SUPER_ADMIN sees all)
 * @access  SUPER_ADMIN, HOD, MENTOR
 */
router.get('/:departmentId/mentors', authenticate, authorize('SUPER_ADMIN', 'HOD', 'MENTOR'), getMentorsByDepartment);

module.exports = router;
