const express = require('express');
const router = express.Router();
const {
  getPersonalInfoController,
  updatePersonalInfoController,
  getPSProgressController,
  updatePSProgressController,
  getCertificationsController,
  createCertificationController,
  updateCertificationController,
  deleteCertificationController,
  approveCertificationController,
  rejectCertificationController,
  getSkillsController,
  getCodingProfilesController,
  getHackathonsController,
  getPublicationsController,
  getCounselingNotesController
} = require('../controllers/studentPortfolioController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/students/:registerNo/personal-info
 * @desc    Get student personal information
 * @access  STUDENT (own), MENTOR (assigned), HOD, SUPER_ADMIN
 */
router.get('/:registerNo/personal-info', authenticate, authorize('STUDENT', 'MENTOR', 'HOD', 'SUPER_ADMIN'), getPersonalInfoController);

/**
 * @route   PUT /api/students/:registerNo/personal-info
 * @desc    Update student personal information
 * @access  STUDENT (own only)
 */
router.put('/:registerNo/personal-info', authenticate, authorize('STUDENT'), updatePersonalInfoController);

/**
 * @route   GET /api/students/:registerNo/ps-progress
 * @desc    Get student PS portal progress
 * @access  STUDENT (own), MENTOR (assigned), HOD, SUPER_ADMIN
 */
router.get('/:registerNo/ps-progress', authenticate, authorize('STUDENT', 'MENTOR', 'HOD', 'SUPER_ADMIN'), getPSProgressController);

/**
 * @route   PUT /api/students/:registerNo/ps-progress
 * @desc    Update student PS portal progress
 * @access  MENTOR (assigned), HOD, SUPER_ADMIN
 */
router.put('/:registerNo/ps-progress', authenticate, authorize('MENTOR', 'HOD', 'SUPER_ADMIN'), updatePSProgressController);

/**
 * @route   GET /api/students/:registerNo/certifications
 * @desc    Get student certifications
 * @access  STUDENT (own), MENTOR (assigned), HOD, SUPER_ADMIN
 */
router.get('/:registerNo/certifications', authenticate, authorize('STUDENT', 'MENTOR', 'HOD', 'SUPER_ADMIN'), getCertificationsController);

/**
 * @route   POST /api/students/:registerNo/certifications
 * @desc    Create certification
 * @access  STUDENT (own only)
 */
router.post('/:registerNo/certifications', authenticate, authorize('STUDENT'), createCertificationController);

/**
 * @route   PUT /api/students/:registerNo/certifications/:id
 * @desc    Update certification
 * @access  STUDENT (own pending only)
 */
router.put('/:registerNo/certifications/:id', authenticate, authorize('STUDENT'), updateCertificationController);

/**
 * @route   DELETE /api/students/:registerNo/certifications/:id
 * @desc    Delete certification
 * @access  STUDENT (own pending only)
 */
router.delete('/:registerNo/certifications/:id', authenticate, authorize('STUDENT'), deleteCertificationController);

/**
 * @route   PUT /api/students/:registerNo/certifications/:id/approve
 * @desc    Approve certification
 * @access  MENTOR (assigned), HOD, SUPER_ADMIN
 */
router.put('/:registerNo/certifications/:id/approve', authenticate, authorize('MENTOR', 'HOD', 'SUPER_ADMIN'), approveCertificationController);

/**
 * @route   PUT /api/students/:registerNo/certifications/:id/reject
 * @desc    Reject certification
 * @access  MENTOR (assigned), HOD, SUPER_ADMIN
 */
router.put('/:registerNo/certifications/:id/reject', authenticate, authorize('MENTOR', 'HOD', 'SUPER_ADMIN'), rejectCertificationController);

/**
 * @route   GET /api/students/:registerNo/skills
 * @desc    Get student skills
 * @access  STUDENT (own), MENTOR (assigned), HOD, SUPER_ADMIN
 */
router.get('/:registerNo/skills', authenticate, authorize('STUDENT', 'MENTOR', 'HOD', 'SUPER_ADMIN'), getSkillsController);

/**
 * @route   GET /api/students/:registerNo/coding-profiles
 * @desc    Get student coding profiles
 * @access  STUDENT (own), MENTOR (assigned), HOD, SUPER_ADMIN
 */
router.get('/:registerNo/coding-profiles', authenticate, authorize('STUDENT', 'MENTOR', 'HOD', 'SUPER_ADMIN'), getCodingProfilesController);

/**
 * @route   GET /api/students/:registerNo/hackathons
 * @desc    Get student hackathons
 * @access  STUDENT (own), MENTOR (assigned), HOD, SUPER_ADMIN
 */
router.get('/:registerNo/hackathons', authenticate, authorize('STUDENT', 'MENTOR', 'HOD', 'SUPER_ADMIN'), getHackathonsController);

/**
 * @route   GET /api/students/:registerNo/publications
 * @desc    Get student publications
 * @access  STUDENT (own), MENTOR (assigned), HOD, SUPER_ADMIN
 */
router.get('/:registerNo/publications', authenticate, authorize('STUDENT', 'MENTOR', 'HOD', 'SUPER_ADMIN'), getPublicationsController);

/**
 * @route   GET /api/students/:registerNo/counseling-notes
 * @desc    Get student counseling notes
 * @access  STUDENT (own), MENTOR (assigned), HOD, SUPER_ADMIN
 */
router.get('/:registerNo/counseling-notes', authenticate, authorize('STUDENT', 'MENTOR', 'HOD', 'SUPER_ADMIN'), getCounselingNotesController);

module.exports = router;
