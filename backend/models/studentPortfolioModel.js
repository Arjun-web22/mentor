const pool = require('../config/db');

/**
 * Student Personal Information Model
 */

// Get personal info by register_no
const getPersonalInfo = async (registerNo) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM student_personal_info WHERE register_no = ?`,
      [registerNo]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new Error('Error fetching personal info: ' + error.message);
  }
};

// Create or update personal info
const upsertPersonalInfo = async (registerNo, data) => {
  try {
    console.log("========== MODEL RECEIVED ==========");
    console.log("registerNo:", registerNo);
    console.log("data:", data);
    console.log("====================================");

    const {
      date_of_birth,
      gender,
      phone,
      personal_email,
      alternate_email,
      college_email,
      blood_group,
      address,
      city,
      state,
      country,
      pincode
    } = data;

    // Normalize date_of_birth to YYYY-MM-DD format for MySQL DATE column
    // Production-safe: validates date before conversion to prevent RangeError
    let formattedDateOfBirth = null;
    if (date_of_birth) {
      const date = new Date(date_of_birth);
      if (!isNaN(date.getTime())) {
        formattedDateOfBirth = date.toISOString().split('T')[0];
      }
      // If date is invalid, formattedDateOfBirth remains null
    }

    // Check if record exists
    const existing = await getPersonalInfo(registerNo);

    if (existing) {
      // Update
      const [result] = await pool.query(
        `UPDATE student_personal_info
         SET date_of_birth = ?, gender = ?, phone = ?, personal_email = ?,
             alternate_email = ?, college_email = ?, blood_group = ?, address = ?,
             city = ?, state = ?, country = ?, pincode = ?
         WHERE register_no = ?`,
        [
          formattedDateOfBirth,
          gender || null,
          phone || null,
          personal_email || null,
          alternate_email || null,
          college_email || null,
          blood_group || null,
          address || null,
          city || null,
          state || null,
          country || null,
          pincode || null,
          registerNo
        ]
      );
      return { ...existing, ...data, id: existing.id };
    } else {
      // Insert
      const [result] = await pool.query(
        `INSERT INTO student_personal_info
         (register_no, date_of_birth, gender, phone, personal_email, alternate_email, college_email, blood_group, address, city, state, country, pincode)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          registerNo,
          formattedDateOfBirth,
          gender || null,
          phone || null,
          personal_email || null,
          alternate_email || null,
          college_email || null,
          blood_group || null,
          address || null,
          city || null,
          state || null,
          country || null,
          pincode || null
        ]
      );
      return { id: result.insertId, register_no: registerNo, ...data };
    }
  } catch (error) {
    console.error('Error upserting personal info:', error);
    throw error;
  }
};

/**
 * Student PS Progress Model
 */

const getPSProgress = async (registerNo) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM student_ps_progress WHERE register_no = ?`,
      [registerNo]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching PS progress:', error);
    throw error;
  }
};

const upsertPSProgress = async (registerNo, data) => {
  try {
    const {
      c_level,
      c_completed_date,
      c_verified_by,
      java_level,
      java_completed_date,
      java_verified_by,
      python_level,
      python_completed_date,
      python_verified_by,
      cpp_level,
      cpp_completed_date,
      cpp_verified_by,
      database_level,
      database_completed_date,
      database_verified_by,
      aptitude_level,
      aptitude_completed_date,
      aptitude_verified_by
    } = data;

    const existing = await getPSProgress(registerNo);

    if (existing) {
      const [result] = await pool.query(
        `UPDATE student_ps_progress 
         SET c_level = ?, c_completed_date = ?, c_verified_by = ?,
             java_level = ?, java_completed_date = ?, java_verified_by = ?,
             python_level = ?, python_completed_date = ?, python_verified_by = ?,
             cpp_level = ?, cpp_completed_date = ?, cpp_verified_by = ?,
             database_level = ?, database_completed_date = ?, database_verified_by = ?,
             aptitude_level = ?, aptitude_completed_date = ?, aptitude_verified_by = ?
         WHERE register_no = ?`,
        [
          c_level || 0,
          c_completed_date || null,
          c_verified_by || null,
          java_level || 0,
          java_completed_date || null,
          java_verified_by || null,
          python_level || 0,
          python_completed_date || null,
          python_verified_by || null,
          cpp_level || 0,
          cpp_completed_date || null,
          cpp_verified_by || null,
          database_level || 0,
          database_completed_date || null,
          database_verified_by || null,
          aptitude_level || 0,
          aptitude_completed_date || null,
          aptitude_verified_by || null,
          registerNo
        ]
      );
      return { ...existing, ...data };
    } else {
      const [result] = await pool.query(
        `INSERT INTO student_ps_progress 
         (register_no, c_level, c_completed_date, c_verified_by, java_level, java_completed_date, java_verified_by, 
          python_level, python_completed_date, python_verified_by, cpp_level, cpp_completed_date, cpp_verified_by,
          database_level, database_completed_date, database_verified_by, aptitude_level, aptitude_completed_date, aptitude_verified_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          registerNo,
          c_level || 0,
          c_completed_date || null,
          c_verified_by || null,
          java_level || 0,
          java_completed_date || null,
          java_verified_by || null,
          python_level || 0,
          python_completed_date || null,
          python_verified_by || null,
          cpp_level || 0,
          cpp_completed_date || null,
          cpp_verified_by || null,
          database_level || 0,
          database_completed_date || null,
          database_verified_by || null,
          aptitude_level || 0,
          aptitude_completed_date || null,
          aptitude_verified_by || null
        ]
      );
      return { id: result.insertId, register_no: registerNo, ...data };
    }
  } catch (error) {
    throw new Error('Error upserting PS progress: ' + error.message);
  }
};

/**
 * Student Certifications Model
 */

const getCertifications = async (registerNo) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM student_certifications WHERE register_no = ? ORDER BY created_at DESC`,
      [registerNo]
    );
    return rows;
  } catch (error) {
    throw new Error('Error fetching certifications: ' + error.message);
  }
};

const getCertificationById = async (id) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM student_certifications WHERE id = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new Error('Error fetching certification: ' + error.message);
  }
};

const createCertification = async (registerNo, data) => {
  try {
    const {
      certificate_name,
      issuer,
      issue_date,
      expiry_date,
      credential_id,
      credential_url,
      certificate_pdf,
      description
    } = data;

    const [result] = await pool.query(
      `INSERT INTO student_certifications 
       (register_no, certificate_name, issuer, issue_date, expiry_date, credential_id, credential_url, certificate_pdf, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        registerNo,
        certificate_name,
        issuer,
        issue_date || null,
        expiry_date || null,
        credential_id || null,
        credential_url || null,
        certificate_pdf || null,
        description || null
      ]
    );
    return { id: result.insertId, register_no: registerNo, ...data, status: 'Pending' };
  } catch (error) {
    throw new Error('Error creating certification: ' + error.message);
  }
};

const updateCertification = async (id, data) => {
  try {
    const {
      certificate_name,
      issuer,
      issue_date,
      expiry_date,
      credential_id,
      credential_url,
      certificate_pdf,
      description
    } = data;

    const [result] = await pool.query(
      `UPDATE student_certifications 
       SET certificate_name = ?, issuer = ?, issue_date = ?, expiry_date = ?, 
           credential_id = ?, credential_url = ?, certificate_pdf = ?, description = ?
       WHERE id = ?`,
      [
        certificate_name,
        issuer,
        issue_date || null,
        expiry_date || null,
        credential_id || null,
        credential_url || null,
        certificate_pdf || null,
        description || null,
        id
      ]
    );
    return { id, ...data };
  } catch (error) {
    throw new Error('Error updating certification: ' + error.message);
  }
};

const deleteCertification = async (id) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM student_certifications WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error('Error deleting certification: ' + error.message);
  }
};

const approveCertification = async (id, approvedBy, remark = null) => {
  try {
    const [result] = await pool.query(
      `UPDATE student_certifications 
       SET status = 'Approved', approved_date = CURDATE(), approved_by = ?, mentor_remark = ?
       WHERE id = ?`,
      [approvedBy, remark, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error('Error approving certification: ' + error.message);
  }
};

const rejectCertification = async (id, approvedBy, remark) => {
  try {
    const [result] = await pool.query(
      `UPDATE student_certifications 
       SET status = 'Rejected', approved_by = ?, mentor_remark = ?
       WHERE id = ?`,
      [approvedBy, remark, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error('Error rejecting certification: ' + error.message);
  }
};

const getSkills = async (registerNo) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM student_skills WHERE register_no = ? ORDER BY skill_name`,
      [registerNo]
    );
    return rows;
  } catch (error) {
    throw new Error('Error fetching skills: ' + error.message);
  }
};

const getCodingProfiles = async (registerNo) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM student_coding_profiles WHERE register_no = ? ORDER BY platform`,
      [registerNo]
    );
    // Group by platform for easier frontend consumption
    const profiles = {};
    rows.forEach(row => {
      profiles[row.platform.toLowerCase()] = {
        username: row.username,
        url: row.profile_url
      };
    });
    return profiles;
  } catch (error) {
    throw new Error('Error fetching coding profiles: ' + error.message);
  }
};

const getHackathons = async (registerNo) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM student_hackathons WHERE register_no = ? ORDER BY event_date DESC`,
      [registerNo]
    );
    return rows.map(row => ({
      id: row.id,
      name: row.hackathon_name,
      organizer: row.organizer,
      position: row.position,
      date: row.event_date,
      certificateUrl: row.certificate_link,
      status: row.status
    }));
  } catch (error) {
    throw new Error('Error fetching hackathons: ' + error.message);
  }
};

const getPublications = async (registerNo) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM student_publications WHERE register_no = ? ORDER BY publication_date DESC`,
      [registerNo]
    );
    const publications = rows.filter(r => r.type !== 'Patent').map(row => ({
      id: row.id,
      title: row.title,
      type: row.type,
      journal: row.journal_name,
      conference: row.conference_name,
      year: row.publication_date ? new Date(row.publication_date).getFullYear() : null,
      status: row.status.toLowerCase()
    }));
    const patents = rows.filter(r => r.type === 'Patent').map(row => ({
      id: row.id,
      title: row.title,
      patentNumber: row.patent_number,
      year: row.publication_date ? new Date(row.publication_date).getFullYear() : null,
      status: row.status
    }));
    return { publications, patents };
  } catch (error) {
    throw new Error('Error fetching publications: ' + error.message);
  }
};

const getCounselingNotes = async (registerNo) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        mn.note_id as id,
        m.full_name as mentorName,
        mn.meeting_date,
        mn.remarks,
        mn.action_plan,
        mn.next_review_date,
        mn.created_at
       FROM mentor_notes mn
       JOIN mentors m ON mn.mentor_id = m.mentor_id
       JOIN students s ON mn.student_id = s.student_id
       WHERE s.register_no = ?
       ORDER BY mn.created_at DESC`,
      [registerNo]
    );
    return rows.map(row => ({
      id: row.id,
      mentorName: row.mentorName,
      category: row.meeting_date ? 'Meeting' : 'General',
      date: row.created_at ? new Date(row.created_at).toLocaleDateString() : null,
      remarks: row.remarks
    }));
  } catch (error) {
    // If table doesn't exist, return empty array instead of throwing error
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return [];
    }
    console.error('Error fetching counseling notes:', error);
    throw new Error('Error fetching counseling notes: ' + error.message);
  }
};

module.exports = {
  // Personal Info
  getPersonalInfo,
  upsertPersonalInfo,
  // PS Progress
  getPSProgress,
  upsertPSProgress,
  // Certifications
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
  approveCertification,
  rejectCertification,
  // Skills
  getSkills,
  // Coding Profiles
  getCodingProfiles,
  // Hackathons
  getHackathons,
  // Publications
  getPublications,
  // Counseling Notes
  getCounselingNotes
};
