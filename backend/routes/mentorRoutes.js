const express = require('express');
const router = express.Router();
const { getMentorById, getStudentsByMentor, getAllMentorsController } = require('../controllers/mentorController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/mentors
 * @desc    Get all mentors
 * @access  Public (for development)
 */
router.get('/', getAllMentorsController);

/**
 * @route   GET /api/mentors/:mentorId
 * @desc    Get mentor details by ID
 * @access  Public (for development)
 */
router.get('/:mentorId', getMentorById);

/**
 * @route   GET /api/mentors/:mentorId/students
 * @desc    Get students assigned to a mentor (placeholder)
 * @access  Public (for development)
 */
router.get('/:mentorId/students', getStudentsByMentor);

module.exports = router;
