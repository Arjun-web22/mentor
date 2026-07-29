const express = require('express');
const router = express.Router();
const { getMentorById, getStudentsByMentor } = require('../controllers/mentorController');

/**
 * @route   GET /api/mentors/:mentorId
 * @desc    Get mentor details by ID
 * @access  Public
 */
router.get('/:mentorId', getMentorById);

/**
 * @route   GET /api/mentors/:mentorId/students
 * @desc    Get students assigned to a mentor (placeholder)
 * @access  Public
 */
router.get('/:mentorId/students', getStudentsByMentor);

module.exports = router;
