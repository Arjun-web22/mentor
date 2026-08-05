const db = require('../config/db');

/**
 * Get students by mentor staff_id
 * @param {string} staffId - Mentor staff_id
 * @returns {Promise<Array>} Array of students
 */
const getStudentsByStaffId = async (staffId) => {
  try {
    console.log("Requested staff_id:", staffId);
    const [rows] = await db.query(
      `SELECT 
        course_degree,
        year,
        section,
        register_no,
        roll_no,
        student_name,
        staff_id,
        staff_name,
        cgpa,
        attendance,
        pending_arrears
      FROM student 
      WHERE staff_id = ?`,
      [staffId]
    );
    console.log("SQL result length:", rows.length);
    
    // Map field names to match frontend expectations
    return rows.map(row => ({
      ...row,
      name: row.student_name,
      registerNo: row.register_no,
      attendancePercentage: row.attendance ? parseFloat(row.attendance) : 0,
      pendingArrearsCount: row.pending_arrears ? parseInt(row.pending_arrears) : 0,
      cgpa: row.cgpa ? parseFloat(row.cgpa) : 0
    }));
  } catch (error) {
    console.error('Error in getStudentsByStaffId model:', error);
    throw error;
  }
};

/**
 * Get student by register number
 * @param {string} registerNo - Student register number
 * @returns {Promise<Object|null>} Student object or null
 */
const getStudentByRegisterNo = async (registerNo) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        s.course_degree,
        s.year,
        s.section,
        s.register_no,
        s.roll_no,
        s.student_name,
        s.staff_id,
        s.staff_name,
        s.cgpa,
        s.attendance,
        s.pending_arrears,
        s.dob,
        s.gender,
        s.batch,
        s.email as college_email,
        s.college_id,
        u.profile_photo,
        u.full_name as mentor_full_name,
        u.phone as mentor_phone,
        d.department_name,
        d.abbreviation as department_abbreviation
      FROM student s
      LEFT JOIN users u ON s.staff_id = u.staff_id
      LEFT JOIN departments d ON u.department_id = d.department_id
      WHERE s.register_no = ?`,
      [registerNo]
    );

    if (rows.length === 0) {
      return null;
    }

    const student = rows[0];
    
    console.log("Student API Response (raw):", student);
    
    // Map field names to match frontend expectations
    // Parse year and semester from the year field if it contains both (e.g., "UG Ist Year-A")
    let year = student.year;
    let semester = null;
    
    if (student.year && typeof student.year === 'string') {
      // Try to extract semester from year field (format: "UG Ist Year-A")
      const match = student.year.match(/-(\w+)$/);
      if (match) {
        semester = match[1];
        // Remove the semester suffix from year
        year = student.year.replace(/-\w+$/, '');
      }
    }
    
    const mappedStudent = {
      name: student.student_name,
      registerNo: student.register_no,
      rollNo: student.roll_no,
      courseDegree: student.course_degree,
      year: year,
      semester: semester || student.year, // Fallback to original year if parsing fails
      section: student.section,
      batch: student.batch,
      dob: student.dob,
      gender: student.gender,
      collegeId: student.college_id,
      staffId: student.staff_id,
      staffName: student.staff_name,
      departmentName: student.department_name || student.department_abbreviation || null,
      departmentAbbreviation: student.department_abbreviation || null,
      mentorName: student.staff_name || student.mentor_full_name || null,
      mentorFullName: student.mentor_full_name || null,
      email: student.college_email || null,
      avatar: student.profile_photo || null,
      attendancePercentage: student.attendance ? parseFloat(student.attendance) : 0,
      pendingArrearsCount: student.pending_arrears ? parseInt(student.pending_arrears) : 0,
      cgpa: student.cgpa ? parseFloat(student.cgpa) : 0,
      phone: student.mentor_phone || null
    };
    
    console.log("Student API Response (mapped):", mappedStudent);
    
    return mappedStudent;
  } catch (error) {
    console.error('Error in getStudentByRegisterNo model:', error);
    throw error;
  }
};

/**
 * Update student information
 * @param {string} registerNo - Student register number
 * @param {Object} updateData - Data to update
 * @returns {Promise<boolean>} True if updated successfully
 */
const updateStudent = async (registerNo, updateData) => {
  try {
    const { student_name, year, section, staff_id } = updateData;
    
    const [result] = await db.query(
      `UPDATE student 
      SET student_name = ?, year = ?, section = ?, staff_id = ?
      WHERE register_no = ?`,
      [student_name, year, section, staff_id, registerNo]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error in updateStudent model:', error);
    throw error;
  }
};

/**
 * Get all students with optional department filtering
 * @param {number|null} departmentId - Optional department ID to filter by
 * @returns {Promise<Array>} Array of all students
 */
const getAllStudents = async (departmentId = null) => {
  try {
    let query, params;

    if (departmentId) {
      // Filter by department using JOIN
      query = `
        SELECT 
          s.course_degree,
          s.year,
          s.section,
          s.register_no,
          s.roll_no,
          s.student_name,
          s.staff_id,
          s.staff_name,
          u.department_id
        FROM student s
        INNER JOIN users u ON s.staff_id = u.staff_id
        WHERE u.department_id = ?
      `;
      params = [departmentId];
    } else {
      // Return all students
      query = `
        SELECT 
          s.course_degree,
          s.year,
          s.section,
          s.register_no,
          s.roll_no,
          s.student_name,
          s.staff_id,
          s.staff_name,
          u.department_id
        FROM student s
        INNER JOIN users u ON s.staff_id = u.staff_id
      `;
      params = [];
    }

    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    console.error('Error in getAllStudents model:', error);
    throw error;
  }
};

/**
 * Count students by staff ID (mentor)
 * @param {string} staffId - Staff ID
 * @returns {Promise<number>} Count of students
 */
const countStudentsByStaffId = async (staffId) => {
  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) as count FROM student WHERE staff_id = ?`,
      [staffId]
    );
    return rows[0].count;
  } catch (error) {
    console.error('Error in countStudentsByStaffId model:', error);
    throw error;
  }
};

module.exports = {
  getStudentsByStaffId,
  getStudentByRegisterNo,
  updateStudent,
  getAllStudents,
  countStudentsByStaffId
};
