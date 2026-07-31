const express = require('express');
const router = express.Router();
const { getAllCollegesController } = require('../controllers/collegeController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/colleges
 * @desc    Get all colleges with statistics
 * @access  SUPER_ADMIN
 */
router.get('/colleges', authenticate, authorize('SUPER_ADMIN'), getAllCollegesController);

module.exports = router;
