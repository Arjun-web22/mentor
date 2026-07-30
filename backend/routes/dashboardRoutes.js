const express = require('express');
const router = express.Router();
const { getSuperAdminDashboard } = require('../controllers/dashboardController');

/**
 * @route   GET /api/dashboard/super-admin
 * @desc    Get super admin dashboard data
 * @access  Public (for development)
 */
router.get('/super-admin', getSuperAdminDashboard);

module.exports = router;
