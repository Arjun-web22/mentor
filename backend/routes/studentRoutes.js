const express = require('express');
const router = express.Router();
const { getMentorStudents, getStudent, updateStudentInfo } = require('../controllers/studentController');

/**
 * @route   GET /api/mentors/:staffId/students
 * @desc    Get all students for a specific mentor
 * @access  Private
 */
router.get('/mentors/:staffId/students', getMentorStudents);

/**
 * @route   GET /api/students/:registerNo
 * @desc    Get student by register number
 * @access  Private
 */
router.get('/students/:registerNo', getStudent);

/**
 * @route   PUT /api/students/:registerNo
 * @desc    Update student information
 * @access  Private
 */
router.put('/students/:registerNo', updateStudentInfo);

module.exports = router;
