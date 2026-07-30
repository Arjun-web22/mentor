const express = require('express');
const router = express.Router();
const { getAllCollegesController } = require('../controllers/collegeController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/colleges
 * @desc    Get all colleges with statistics
 * @access  Public (for development)
 */
router.get('/colleges', getAllCollegesController);

module.exports = router;
