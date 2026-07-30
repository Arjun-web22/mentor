const express = require('express');
const router = express.Router();
const { getMentorStudents, getStudent, updateStudentInfo, getAllStudentsController } = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/mentors/:staffId/students
 * @desc    Get all students for a specific mentor
 * @access  Public (for development)
 */
router.get('/mentors/:staffId/students', getMentorStudents);

/**
 * @route   GET /api/students
 * @desc    Get all students
 * @access  Public (for development)
 */
router.get('/students', getAllStudentsController);

/**
 * @route   GET /api/students/:registerNo
 * @desc    Get student by register number
 * @access  Public (for development)
 */
router.get('/students/:registerNo', getStudent);

/**
 * @route   PUT /api/students/:registerNo
 * @desc    Update student information
 * @access  Private (SUPER_ADMIN, HOD, MENTOR)
 */
router.put('/students/:registerNo', authenticate, authorize('SUPER_ADMIN', 'HOD', 'MENTOR'), updateStudentInfo);

module.exports = router;
