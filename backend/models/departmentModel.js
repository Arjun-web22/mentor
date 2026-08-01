const pool = require('../config/db');

/**
 * Fetch all departments with optional college filtering
 * @param {number|null} collegeId - Optional college ID to filter by
 * @returns {Promise<Array>} Array of department objects
 */
const fetchDepartments = async (collegeId = null) => {
  try {
    console.log("fetchDepartments - collegeId:", collegeId);
    let query, params;
    
    if (collegeId) {
      query = `
        SELECT department_id, college_id, department_code, department_name, abbreviation
        FROM departments
        WHERE college_id = ?
        ORDER BY department_name
      `;
      params = [collegeId];
    } else {
      query = `
        SELECT department_id, college_id, department_code, department_name, abbreviation
        FROM departments
        ORDER BY department_name
      `;
      params = [];
    }
    
    console.log("fetchDepartments - SQL:", query);
    console.log("fetchDepartments - Params:", params);
    
    const [rows] = await pool.query(query, params);
    
    console.log("fetchDepartments - Result count:", rows.length);
    
    return rows.map(row => ({
      ...row,
      department_id: Number(row.department_id),
      college_id: Number(row.college_id)
    }));
  } catch (error) {
    console.error("fetchDepartments - Error:", error);
    console.error("fetchDepartments - Error stack:", error.stack);
    throw new Error('Error fetching departments: ' + error.message);
  }
};

/**
 * Fetch mentors by department ID with optional college filtering
 * @param {number} departmentId - Department ID
 * @param {number|null} collegeId - Optional college ID to filter by
 * @returns {Promise<Array>} Array of mentor objects
 */
const fetchMentorsByDepartment = async (departmentId, collegeId = null) => {
  try {
    let query, params;
    
    if (collegeId) {
      query = `
        SELECT 
          u.user_id, 
          u.staff_id, 
          u.full_name, 
          u.designation, 
          u.email, 
          u.phone,
          u.department_id, 
          u.is_active,
          COUNT(s.register_no) AS total_students,
          ROUND(AVG(s.cgpa), 2) AS avg_cgpa,
          ROUND(AVG(s.attendance), 2) AS avg_attendance,
          COALESCE(SUM(s.pending_arrears), 0) AS total_arrears
        FROM users u
        INNER JOIN departments d ON u.department_id = d.department_id
        LEFT JOIN student s ON u.staff_id = s.staff_id
        WHERE u.department_id = ? 
        AND d.college_id = ?
        AND u.role IN ('MENTOR', 'HOD')
        GROUP BY u.user_id, u.staff_id, u.full_name, u.designation, u.email, u.phone, u.department_id, u.is_active
        ORDER BY u.full_name
      `;
      params = [departmentId, collegeId];
    } else {
      query = `
        SELECT 
          u.user_id, 
          u.staff_id, 
          u.full_name, 
          u.designation, 
          u.email, 
          u.phone,
          u.department_id, 
          u.is_active,
          COUNT(s.register_no) AS total_students,
          ROUND(AVG(s.cgpa), 2) AS avg_cgpa,
          ROUND(AVG(s.attendance), 2) AS avg_attendance,
          COALESCE(SUM(s.pending_arrears), 0) AS total_arrears
        FROM users u
        LEFT JOIN student s ON u.staff_id = s.staff_id
        WHERE u.department_id = ? 
        AND u.role IN ('MENTOR', 'HOD')
        GROUP BY u.user_id, u.staff_id, u.full_name, u.designation, u.email, u.phone, u.department_id, u.is_active
        ORDER BY u.full_name
      `;
      params = [departmentId];
    }
    
    const [rows] = await pool.query(query, params);
    
    return rows;
  } catch (error) {
    throw new Error('Error fetching mentors by department: ' + error.message);
  }
};

/**
 * Get department name by ID from database
 * @param {number} departmentId - Department ID
 * @returns {Promise<string|null>} Department name or null if not found
 */
const getDepartmentName = async (departmentId) => {
  try {
    const [rows] = await pool.query(
      `SELECT department_name FROM departments WHERE department_id = ?`,
      [departmentId]
    );
    return rows.length > 0 ? rows[0].department_name : null;
  } catch (error) {
    console.error('Error fetching department name:', error);
    return null;
  }
};

/**
 * Count students by department ID with optional college filtering
 * @param {number} departmentId - Department ID
 * @param {number|null} collegeId - Optional college ID to filter by
 * @returns {Promise<number>} Count of students
 */
const countStudentsByDepartment = async (departmentId, collegeId = null) => {
  try {
    let query, params;
    
    if (collegeId) {
      query = `
        SELECT COUNT(*) AS count
        FROM student s
        INNER JOIN users u ON s.staff_id = u.staff_id
        INNER JOIN departments d ON u.department_id = d.department_id
        WHERE u.department_id = ?
        AND d.college_id = ?
      `;
      params = [departmentId, collegeId];
    } else {
      query = `
        SELECT COUNT(*) AS count
        FROM student s
        INNER JOIN users u
        ON s.staff_id = u.staff_id
        WHERE u.department_id = ?
      `;
      params = [departmentId];
    }

    const [rows] = await pool.query(query, params);

    return rows[0].count;
  } catch (error) {
    throw new Error('Error counting students by department: ' + error.message);
  }
};

/**
 * Count mentors by department ID with optional college filtering
 * @param {number} departmentId - Department ID
 * @param {number|null} collegeId - Optional college ID to filter by
 * @returns {Promise<number>} Count of mentors
 */
const countMentorsByDepartment = async (departmentId, collegeId = null) => {
  try {
    let query, params;
    
    if (collegeId) {
      query = `
        SELECT COUNT(*) as count 
        FROM users u
        INNER JOIN departments d ON u.department_id = d.department_id
        WHERE u.department_id = ? 
        AND u.role = 'MENTOR'
        AND d.college_id = ?
      `;
      params = [departmentId, collegeId];
    } else {
      query = `
        SELECT COUNT(*) as count FROM users WHERE department_id = ? AND role = 'MENTOR'
      `;
      params = [departmentId];
    }
    
    const [rows] = await pool.query(query, params);
    return rows[0].count;
  } catch (error) {
    throw new Error('Error counting mentors by department: ' + error.message);
  }
};

/**
 * Get department analytics data with optional college filtering
 * @param {number|null} collegeId - Optional college ID to filter by
 * @returns {Promise<Array>} Array of department analytics
 */
const getDepartmentAnalytics = async (collegeId = null) => {
  try {
    console.log("getDepartmentAnalytics - collegeId:", collegeId);
    let studentQuery, studentParams;
    
    if (collegeId) {
      studentQuery = `
        SELECT
            u.department_id,
            COUNT(s.register_no) AS student_count,
            ROUND(AVG(s.cgpa),2) AS avg_cgpa,
            ROUND(AVG(s.attendance),2) AS avg_attendance
        FROM student s
        INNER JOIN users u ON s.staff_id = u.staff_id
        INNER JOIN departments d ON u.department_id = d.department_id
        WHERE d.college_id = ?
        GROUP BY u.department_id
      `;
      studentParams = [collegeId];
    } else {
      studentQuery = `
        SELECT
            u.department_id,
            COUNT(s.register_no) AS student_count,
            ROUND(AVG(s.cgpa),2) AS avg_cgpa,
            ROUND(AVG(s.attendance),2) AS avg_attendance
        FROM student s
        INNER JOIN users u ON s.staff_id = u.staff_id
        GROUP BY u.department_id
      `;
      studentParams = [];
    }

    console.log("getDepartmentAnalytics - Student SQL:", studentQuery);
    console.log("getDepartmentAnalytics - Student Params:", studentParams);

    const [rows] = await pool.query(studentQuery, studentParams);

    console.log("Department Analytics SQL Result:", rows);

    let mentorQuery, mentorParams;
    
    if (collegeId) {
      mentorQuery = `
        SELECT
            u.department_id,
            COUNT(*) AS mentor_count
        FROM users u
        INNER JOIN departments d ON u.department_id = d.department_id
        WHERE u.role IN ('MENTOR','HOD')
        AND d.college_id = ?
        GROUP BY u.department_id
      `;
      mentorParams = [collegeId];
    } else {
      mentorQuery = `
        SELECT
            department_id,
            COUNT(*) AS mentor_count
        FROM users
        WHERE role IN ('MENTOR','HOD')
        GROUP BY department_id
      `;
      mentorParams = [];
    }

    console.log("getDepartmentAnalytics - Mentor SQL:", mentorQuery);
    console.log("getDepartmentAnalytics - Mentor Params:", mentorParams);

    const [mentorRows] = await pool.query(mentorQuery, mentorParams);

    console.log("Mentor Count SQL Result:", mentorRows);

    const result = rows.map(row => ({
      department_id: Number(row.department_id),
      student_count: Number(row.student_count),
      mentor_count:
        Number(
          mentorRows.find(
            m => Number(m.department_id) === Number(row.department_id)
          )?.mentor_count || 0
        ),
      avg_cgpa: Number(row.avg_cgpa || 0),
      avg_attendance: Number(row.avg_attendance || 0)
    }));

    console.log("Department Analytics Final Result:", result);

    return result;

  } catch(error){
    console.error("getDepartmentAnalytics - Error:", error);
    console.error("getDepartmentAnalytics - Error stack:", error.stack);
    throw new Error(error.message);
  }
};

/**
 * Get mentor analytics by department ID with optional college filtering
 * @param {number} departmentId - Department ID
 * @param {number|null} collegeId - Optional college ID to filter by
 * @returns {Promise<Array>} Array of mentor analytics
 */
const getMentorAnalyticsByDepartment = async (departmentId, collegeId = null) => {
  try {
    let query, params;
    
    if (collegeId) {
      query = `
        SELECT
          u.staff_id,
          u.full_name,
          u.designation,
          u.email,
          u.phone,
          COUNT(s.register_no) AS total_students,
          ROUND(AVG(s.cgpa),2) AS avg_cgpa,
          ROUND(AVG(s.attendance),2) AS avg_attendance,
          SUM(s.pending_arrears) AS total_arrears
         FROM users u
         LEFT JOIN student s ON u.staff_id = s.staff_id
         INNER JOIN departments d ON u.department_id = d.department_id
         WHERE u.department_id = ?
         AND d.college_id = ?
         AND u.role IN ('MENTOR','HOD')
         GROUP BY u.staff_id, u.full_name, u.designation, u.email, u.phone
         ORDER BY u.full_name
      `;
      params = [departmentId, collegeId];
    } else {
      query = `
        SELECT
          u.staff_id,
          u.full_name,
          u.designation,
          u.email,
          u.phone,
          COUNT(s.register_no) AS total_students,
          ROUND(AVG(s.cgpa),2) AS avg_cgpa,
          ROUND(AVG(s.attendance),2) AS avg_attendance,
          SUM(s.pending_arrears) AS total_arrears
         FROM users u
         LEFT JOIN student s ON u.staff_id = s.staff_id
         WHERE u.department_id = ?
         AND u.role IN ('MENTOR','HOD')
         GROUP BY u.staff_id, u.full_name, u.designation, u.email, u.phone
         ORDER BY u.full_name
      `;
      params = [departmentId];
    }
    
    const [rows] = await pool.query(query, params);
    
    console.log("Mentor Analytics SQL Result for department", departmentId, ":", rows);

    const result = rows.map(row => ({
      staff_id: row.staff_id,
      full_name: row.full_name,
      designation: row.designation,
      email: row.email,
      phone: row.phone,
      total_students: Number(row.total_students || 0),
      avg_cgpa: Number(row.avg_cgpa || 0),
      avg_attendance: Number(row.avg_attendance || 0),
      total_arrears: Number(row.total_arrears || 0)
    }));

    console.log("Mentor Analytics Final Result:", result);

    return result;
  } catch (error) {
    throw new Error('Error fetching mentor analytics: ' + error.message);
  }
};

module.exports = {
  fetchDepartments,
  fetchMentorsByDepartment,
  getDepartmentName,
  countStudentsByDepartment,
  countMentorsByDepartment,
  getDepartmentAnalytics,
  getMentorAnalyticsByDepartment
};
