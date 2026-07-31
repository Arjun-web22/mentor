const express = require('express');
const router = express.Router();
const { getMentorStudents, getStudent, updateStudentInfo, getAllStudentsController } = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/mentors/:staffId/students
 * @desc    Get all students for a specific mentor (SUPER_ADMIN sees all, HOD sees their department, MENTOR sees their own)
 * @access  SUPER_ADMIN, HOD, MENTOR
 */
router.get('/mentors/:staffId/students', authenticate, authorize('SUPER_ADMIN', 'HOD', 'MENTOR'), getMentorStudents);

/**
 * @route   GET /api/students
 * @desc    Get all students (SUPER_ADMIN sees all, HOD sees their department, MENTOR sees their own)
 * @access  SUPER_ADMIN, HOD, MENTOR
 */
router.get('/students', authenticate, authorize('SUPER_ADMIN', 'HOD', 'MENTOR'), getAllStudentsController);

/**
 * @route   GET /api/students/:registerNo
 * @desc    Get student by register number (SUPER_ADMIN sees all, HOD sees their department, MENTOR sees their own)
 * @access  SUPER_ADMIN, HOD, MENTOR
 */
router.get('/students/:registerNo', authenticate, authorize('SUPER_ADMIN', 'HOD', 'MENTOR'), getStudent);

/**
 * @route   PUT /api/students/:registerNo
 * @desc    Update student information
 * @access  SUPER_ADMIN, HOD, MENTOR
 */
router.put('/students/:registerNo', authenticate, authorize('SUPER_ADMIN', 'HOD', 'MENTOR'), updateStudentInfo);

module.exports = router;
