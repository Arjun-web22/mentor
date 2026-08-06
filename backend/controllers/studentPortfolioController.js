const pool = require('../config/db');
const {
  getPersonalInfo,
  upsertPersonalInfo,
  getPSProgress,
  upsertPSProgress,
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
  approveCertification,
  rejectCertification,
  getSkills,
  getCodingProfiles,
  getHackathons,
  getPublications,
  getCounselingNotes
} = require('../models/studentPortfolioModel');

/**
 * Get Student Personal Information
 * @route GET /api/students/:registerNo/personal-info
 */
const getPersonalInfoController = async (req, res) => {
  try {
    const { registerNo } = req.params;

    // RBAC: Students can only view their own info
    if (req.user.role === 'STUDENT' && req.user.register_no !== registerNo) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own information.'
      });
    }

    // Mentors can only view their assigned students
    if (req.user.role === 'MENTOR') {
      // Check if student is assigned to this mentor
      const [assigned] = await pool.query(
        'SELECT 1 FROM student WHERE register_no = ? AND staff_id = ?',
        [registerNo, req.user.staff_id]
      );
      if (assigned.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This student is not assigned to you.'
        });
      }
    }

    const personalInfo = await getPersonalInfo(registerNo);

    res.status(200).json({
      success: true,
      data: personalInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update Student Personal Information
 * @route PUT /api/students/:registerNo/personal-info
 */
const updatePersonalInfoController = async (req, res) => {
  try {
    const { registerNo } = req.params;

    // RBAC: Only students can update their own personal info
    if (req.user.role !== 'STUDENT' || req.user.register_no !== registerNo) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only students can update their own personal information.'
      });
    }

    const personalInfo = await upsertPersonalInfo(registerNo, req.body);

    res.status(200).json({
      success: true,
      data: personalInfo,
      message: 'Personal information updated successfully'
    });
  } catch (error) {
    console.error('Error updating personal info:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Student PS Progress
 * @route GET /api/students/:registerNo/ps-progress
 */
const getPSProgressController = async (req, res) => {
  try {
    const { registerNo } = req.params;

    // RBAC: Students can only view their own progress
    if (req.user.role === 'STUDENT' && req.user.register_no !== registerNo) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own progress.'
      });
    }

    // Mentors can only view their assigned students
    if (req.user.role === 'MENTOR') {
      const [assigned] = await pool.query(
        'SELECT 1 FROM student WHERE register_no = ? AND staff_id = ?',
        [registerNo, req.user.staff_id]
      );
      if (assigned.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This student is not assigned to you.'
        });
      }
    }

    const psProgress = await getPSProgress(registerNo);

    res.status(200).json({
      success: true,
      data: psProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update Student PS Progress
 * @route PUT /api/students/:registerNo/ps-progress
 */
const updatePSProgressController = async (req, res) => {
  try {
    const { registerNo } = req.params;

    // RBAC: Only Mentors, HODs, and Super Admin can update PS progress
    if (req.user.role === 'STUDENT') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Students cannot update their own PS progress.'
      });
    }

    // Mentors can only update their assigned students
    if (req.user.role === 'MENTOR') {
      const [assigned] = await pool.query(
        'SELECT 1 FROM student WHERE register_no = ? AND staff_id = ?',
        [registerNo, req.user.staff_id]
      );
      if (assigned.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This student is not assigned to you.'
        });
      }
    }

    const psProgress = await upsertPSProgress(registerNo, req.body);

    res.status(200).json({
      success: true,
      data: psProgress,
      message: 'PS progress updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Student Certifications
 * @route GET /api/students/:registerNo/certifications
 */
const getCertificationsController = async (req, res) => {
  try {
    const { registerNo } = req.params;

    // RBAC: Students can view own, Mentors can view assigned, HODs can view department, Super Admin can view all
    if (req.user.role === 'STUDENT' && req.user.register_no !== registerNo) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own certifications.'
      });
    }

    if (req.user.role === 'MENTOR') {
      const [assigned] = await pool.query(
        'SELECT 1 FROM student WHERE register_no = ? AND staff_id = ?',
        [registerNo, req.user.staff_id]
      );
      if (assigned.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This student is not assigned to you.'
        });
      }
    }

    const certifications = await getCertifications(registerNo);

    res.status(200).json({
      success: true,
      data: certifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create Certification
 * @route POST /api/students/:registerNo/certifications
 */
const createCertificationController = async (req, res) => {
  try {
    const { registerNo } = req.params;

    // RBAC: Only students can create their own certifications
    if (req.user.role !== 'STUDENT' || req.user.register_no !== registerNo) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only students can add their own certifications.'
      });
    }

    const certification = await createCertification(registerNo, req.body);

    res.status(201).json({
      success: true,
      data: certification,
      message: 'Certification added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update Certification
 * @route PUT /api/students/:registerNo/certifications/:id
 */
const updateCertificationController = async (req, res) => {
  try {
    const { registerNo, id } = req.params;

    // RBAC: Students can only update their own pending certifications
    if (req.user.role === 'STUDENT') {
      if (req.user.register_no !== registerNo) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update your own certifications.'
        });
      }
      const certification = await getCertificationById(id);
      if (!certification || certification.register_no !== registerNo) {
        return res.status(404).json({
          success: false,
          message: 'Certification not found.'
        });
      }
      if (certification.status !== 'Pending') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update pending certifications.'
        });
      }
    }

    const certification = await updateCertification(id, req.body);

    res.status(200).json({
      success: true,
      data: certification,
      message: 'Certification updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete Certification
 * @route DELETE /api/students/:registerNo/certifications/:id
 */
const deleteCertificationController = async (req, res) => {
  try {
    const { registerNo, id } = req.params;

    // RBAC: Students can only delete their own pending certifications
    if (req.user.role === 'STUDENT') {
      if (req.user.register_no !== registerNo) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only delete your own certifications.'
        });
      }
      const certification = await getCertificationById(id);
      if (!certification || certification.register_no !== registerNo) {
        return res.status(404).json({
          success: false,
          message: 'Certification not found.'
        });
      }
      if (certification.status !== 'Pending') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only delete pending certifications.'
        });
      }
    }

    const deleted = await deleteCertification(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Certification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Approve Certification
 * @route PUT /api/students/:registerNo/certifications/:id/approve
 */
const approveCertificationController = async (req, res) => {
  try {
    const { registerNo, id } = req.params;
    const { remark } = req.body;

    // RBAC: Only Mentors, HODs, and Super Admin can approve
    if (req.user.role === 'STUDENT') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Students cannot approve certifications.'
      });
    }

    // Mentors can only approve their assigned students
    if (req.user.role === 'MENTOR') {
      const [assigned] = await pool.query(
        'SELECT 1 FROM student WHERE register_no = ? AND staff_id = ?',
        [registerNo, req.user.staff_id]
      );
      if (assigned.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This student is not assigned to you.'
        });
      }
    }

    const approved = await approveCertification(id, req.user.staff_id || req.user.userId, remark);

    if (!approved) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Certification approved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Reject Certification
 * @route PUT /api/students/:registerNo/certifications/:id/reject
 */
const rejectCertificationController = async (req, res) => {
  try {
    const { registerNo, id } = req.params;
    const { remark } = req.body;

    if (!remark) {
      return res.status(400).json({
        success: false,
        message: 'Remark is required for rejection.'
      });
    }

    // RBAC: Only Mentors, HODs, and Super Admin can reject
    if (req.user.role === 'STUDENT') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Students cannot reject certifications.'
      });
    }

    // Mentors can only reject their assigned students
    if (req.user.role === 'MENTOR') {
      const [assigned] = await pool.query(
        'SELECT 1 FROM student WHERE register_no = ? AND staff_id = ?',
        [registerNo, req.user.staff_id]
      );
      if (assigned.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This student is not assigned to you.'
        });
      }
    }

    const rejected = await rejectCertification(id, req.user.staff_id || req.user.userId, remark);

    if (!rejected) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Certification rejected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Student Skills
 * @route GET /api/students/:registerNo/skills
 */
const getSkillsController = async (req, res) => {
  try {
    const { registerNo } = req.params;

    // RBAC: Students can view own, Mentors can view assigned
    if (req.user.role === 'STUDENT' && req.user.register_no !== registerNo) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own skills.'
      });
    }

    if (req.user.role === 'MENTOR') {
      const [assigned] = await pool.query(
        'SELECT 1 FROM student WHERE register_no = ? AND staff_id = ?',
        [registerNo, req.user.staff_id]
      );
      if (assigned.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This student is not assigned to you.'
        });
      }
    }

    const skills = await getSkills(registerNo);

    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Student Coding Profiles
 * @route GET /api/students/:registerNo/coding-profiles
 */
const getCodingProfilesController = async (req, res) => {
  try {
    const { registerNo } = req.params;

    // RBAC: Students can view own, Mentors can view assigned
    if (req.user.role === 'STUDENT' && req.user.register_no !== registerNo) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own coding profiles.'
      });
    }

    if (req.user.role === 'MENTOR') {
      const [assigned] = await pool.query(
        'SELECT 1 FROM student WHERE register_no = ? AND staff_id = ?',
        [registerNo, req.user.staff_id]
      );
      if (assigned.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This student is not assigned to you.'
        });
      }
    }

    const profiles = await getCodingProfiles(registerNo);

    res.status(200).json({
      success: true,
      data: profiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Student Hackathons
 * @route GET /api/students/:registerNo/hackathons
 */
const getHackathonsController = async (req, res) => {
  try {
    const { registerNo } = req.params;

    // RBAC: Students can view own, Mentors can view assigned
    if (req.user.role === 'STUDENT' && req.user.register_no !== registerNo) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own hackathons.'
      });
    }

    if (req.user.role === 'MENTOR') {
      const [assigned] = await pool.query(
        'SELECT 1 FROM student WHERE register_no = ? AND staff_id = ?',
        [registerNo, req.user.staff_id]
      );
      if (assigned.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This student is not assigned to you.'
        });
      }
    }

    const hackathons = await getHackathons(registerNo);

    res.status(200).json({
      success: true,
      data: hackathons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Student Publications
 * @route GET /api/students/:registerNo/publications
 */
const getPublicationsController = async (req, res) => {
  try {
    const { registerNo } = req.params;

    // RBAC: Students can view own, Mentors can view assigned
    if (req.user.role === 'STUDENT' && req.user.register_no !== registerNo) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own publications.'
      });
    }

    if (req.user.role === 'MENTOR') {
      const [assigned] = await pool.query(
        'SELECT 1 FROM student WHERE register_no = ? AND staff_id = ?',
        [registerNo, req.user.staff_id]
      );
      if (assigned.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This student is not assigned to you.'
        });
      }
    }

    const publications = await getPublications(registerNo);

    res.status(200).json({
      success: true,
      data: publications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Student Counseling Notes
 * @route GET /api/students/:registerNo/counseling-notes
 */
const getCounselingNotesController = async (req, res) => {
  try {
    const { registerNo } = req.params;

    // RBAC: Students can view own, Mentors can view assigned
    if (req.user.role === 'STUDENT' && req.user.register_no !== registerNo) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own counseling notes.'
      });
    }

    if (req.user.role === 'MENTOR') {
      const [assigned] = await pool.query(
        'SELECT 1 FROM student WHERE register_no = ? AND staff_id = ?',
        [registerNo, req.user.staff_id]
      );
      if (assigned.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This student is not assigned to you.'
        });
      }
    }

    const notes = await getCounselingNotes(registerNo);

    res.status(200).json({
      success: true,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  // Personal Info
  getPersonalInfoController,
  updatePersonalInfoController,
  // PS Progress
  getPSProgressController,
  updatePSProgressController,
  // Certifications
  getCertificationsController,
  createCertificationController,
  updateCertificationController,
  deleteCertificationController,
  approveCertificationController,
  rejectCertificationController,
  // Skills
  getSkillsController,
  // Coding Profiles
  getCodingProfilesController,
  // Hackathons
  getHackathonsController,
  // Publications
  getPublicationsController,
  // Counseling Notes
  getCounselingNotesController
};
