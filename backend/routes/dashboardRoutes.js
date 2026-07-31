const express = require('express');
const router = express.Router();
const { getSuperAdminDashboard, getHODDashboard } = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/dashboard/super-admin
 * @desc    Get super admin dashboard data
 * @access  SUPER_ADMIN
 */
router.get('/super-admin', authenticate, authorize('SUPER_ADMIN'), getSuperAdminDashboard);

/**
 * @route   GET /api/dashboard/hod
 * @desc    Get HOD dashboard data
 * @access  HOD
 */
router.get('/hod', authenticate, authorize('HOD'), getHODDashboard);

module.exports = router;
