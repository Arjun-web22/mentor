const express = require('express');
const router = express.Router();
const { getMentorById, getStudentsByMentor, getAllMentorsController } = require('../controllers/mentorController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/mentors
 * @desc    Get all mentors (SUPER_ADMIN sees all, HOD sees their department)
 * @access  SUPER_ADMIN, HOD
 */
router.get('/', authenticate, authorize('SUPER_ADMIN', 'HOD'), getAllMentorsController);

/**
 * @route   GET /api/mentors/:mentorId
 * @desc    Get mentor details by ID (SUPER_ADMIN sees all, HOD sees their department, MENTOR sees themselves)
 * @access  SUPER_ADMIN, HOD, MENTOR
 */
router.get('/:mentorId', authenticate, authorize('SUPER_ADMIN', 'HOD', 'MENTOR'), getMentorById);

/**
 * @route   GET /api/mentors/:mentorId/students
 * @desc    Get students assigned to a mentor (SUPER_ADMIN sees all, HOD sees their department, MENTOR sees their own students)
 * @access  SUPER_ADMIN, HOD, MENTOR
 */
router.get('/:mentorId/students', authenticate, authorize('SUPER_ADMIN', 'HOD', 'MENTOR'), getStudentsByMentor);

module.exports = router;
