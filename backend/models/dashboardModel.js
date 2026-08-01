const pool = require('../config/db');
const { fetchDepartments } = require('./departmentModel');

/**
 * Get total colleges count
 * @returns {Promise<number>} Total colleges
 */
const getTotalColleges = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(DISTINCT college_id) AS total_colleges FROM users`
    );
    return rows[0].total_colleges || 0;
  } catch (error) {
    throw new Error('Error fetching total colleges: ' + error.message);
  }
};

/**
 * Get total departments count
 * @returns {Promise<number>} Total departments
 */
const getTotalDepartments = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(DISTINCT department_id) AS total_departments FROM users`
    );
    return rows[0].total_departments || 0;
  } catch (error) {
    throw new Error('Error fetching total departments: ' + error.message);
  }
};

/**
 * Get total mentors count
 * @returns {Promise<number>} Total mentors
 */
const getTotalMentors = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS total_mentors FROM users WHERE role IN ('MENTOR', 'HOD')`
    );
    return rows[0].total_mentors || 0;
  } catch (error) {
    throw new Error('Error fetching total mentors: ' + error.message);
  }
};

/**
 * Get total students count
 * @returns {Promise<number>} Total students
 */
const getTotalStudents = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS total_students FROM student`
    );
    return rows[0].total_students || 0;
  } catch (error) {
    throw new Error('Error fetching total students: ' + error.message);
  }
};

/**
 * Get department-wise average CGPA
 * @returns {Promise<Array>} Array of department CGPA data
 */
const getDepartmentCGPA = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT
        u.department_id,
        ROUND(AVG(s.cgpa), 2) AS avg_cgpa
       FROM student s
       JOIN users u ON s.staff_id = u.staff_id
       WHERE s.cgpa IS NOT NULL
       GROUP BY u.department_id
       ORDER BY u.department_id`
    );
    return rows.map(row => ({ ...row, department_id: Number(row.department_id) }));
  } catch (error) {
    throw new Error('Error fetching department CGPA: ' + error.message);
  }
};

/**
 * Get department-wise average attendance
 * @returns {Promise<Array>} Array of department attendance data
 */
const getDepartmentAttendance = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT
        u.department_id,
        ROUND(AVG(s.attendance), 2) AS avg_attendance
       FROM student s
       JOIN users u ON s.staff_id = u.staff_id
       WHERE s.attendance IS NOT NULL
       GROUP BY u.department_id
       ORDER BY u.department_id`
    );
    return rows.map(row => ({ ...row, department_id: Number(row.department_id) }));
  } catch (error) {
    throw new Error('Error fetching department attendance: ' + error.message);
  }
};

/**
 * Get department-wise student count
 * @returns {Promise<Array>} Array of department student count data
 */
const getDepartmentStudentCount = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT
        u.department_id,
        COUNT(*) AS total_students
       FROM student s
       JOIN users u ON s.staff_id = u.staff_id
       GROUP BY u.department_id
       ORDER BY u.department_id`
    );
    return rows.map(row => ({ ...row, department_id: Number(row.department_id) }));
  } catch (error) {
    throw new Error('Error fetching department student count: ' + error.message);
  }
};

/**
 * Get department-wise mentor count
 * @returns {Promise<Array>} Array of department mentor count data
 */
const getDepartmentMentorCount = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT
        department_id,
        COUNT(*) AS total_mentors
       FROM users
       WHERE role IN ('MENTOR', 'HOD')
       GROUP BY department_id
       ORDER BY department_id`
    );
    return rows.map(row => ({ ...row, department_id: Number(row.department_id) }));
  } catch (error) {
    throw new Error('Error fetching department mentor count: ' + error.message);
  }
};

/**
 * Get arrear statistics
 * @returns {Promise<Object>} Arrear statistics
 */
const getArrearStats = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT
        SUM(CASE WHEN pending_arrears = 0 THEN 1 ELSE 0 END) AS zero_arrears,
        SUM(CASE WHEN pending_arrears = 1 THEN 1 ELSE 0 END) AS one_arrear,
        SUM(CASE WHEN pending_arrears >= 2 THEN 1 ELSE 0 END) AS two_plus_arrears
       FROM student
       WHERE pending_arrears IS NOT NULL`
    );
    return {
      zeroArrears: rows[0].zero_arrears || 0,
      oneArrear: rows[0].one_arrear || 0,
      twoPlusArrears: rows[0].two_plus_arrears || 0
    };
  } catch (error) {
    throw new Error('Error fetching arrear stats: ' + error.message);
  }
};

/**
 * Get low attendance count (attendance < 75%)
 * @returns {Promise<number>} Count of students with low attendance
 */
const getLowAttendanceCount = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS low_attendance_count
       FROM student
       WHERE attendance < 75 AND attendance IS NOT NULL`
    );
    return rows[0].low_attendance_count || 0;
  } catch (error) {
    throw new Error('Error fetching low attendance count: ' + error.message);
  }
};

/**
 * Get top students count (CGPA >= 8.5)
 * @returns {Promise<number>} Count of top performing students
 */
const getTopStudentsCount = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS top_students_count
       FROM student
       WHERE cgpa >= 8.5 AND cgpa IS NOT NULL`
    );
    return rows[0].top_students_count || 0;
  } catch (error) {
    throw new Error('Error fetching top students count: ' + error.message);
  }
};

/**
 * Get top 5 mentors by average student CGPA
 * @returns {Promise<Array>} Array of top mentors
 */
const getTopMentors = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT
        u.staff_id,
        u.full_name,
        ROUND(AVG(s.cgpa), 2) AS avg_cgpa,
        COUNT(s.register_no) AS total_students
       FROM users u
       JOIN student s ON u.staff_id = s.staff_id
       WHERE u.role IN ('MENTOR', 'HOD') AND s.cgpa IS NOT NULL
       GROUP BY u.staff_id, u.full_name
       ORDER BY avg_cgpa DESC
       LIMIT 5`
    );
    return rows;
  } catch (error) {
    throw new Error('Error fetching top mentors: ' + error.message);
  }
};

/**
 * Get overall statistics
 * @returns {Promise<Object>} Overall statistics
 */
const getOverallStatistics = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT
        ROUND(AVG(cgpa), 2) AS avg_cgpa,
        ROUND(AVG(attendance), 2) AS avg_attendance,
        ROUND(MAX(cgpa), 2) AS highest_cgpa,
        ROUND(MIN(cgpa), 2) AS lowest_cgpa,
        ROUND(MAX(attendance), 2) AS highest_attendance,
        ROUND(MIN(attendance), 2) AS lowest_attendance
       FROM student
       WHERE cgpa IS NOT NULL AND attendance IS NOT NULL`
    );
    return {
      avgCgpa: Number(rows[0].avg_cgpa || 0),
      avgAttendance: Number(rows[0].avg_attendance || 0),
      highestCgpa: Number(rows[0].highest_cgpa || 0),
      lowestCgpa: Number(rows[0].lowest_cgpa || 0),
      highestAttendance: Number(rows[0].highest_attendance || 0),
      lowestAttendance: Number(rows[0].lowest_attendance || 0)
    };
  } catch (error) {
    throw new Error('Error fetching overall statistics: ' + error.message);
  }
};

/**
 * Get all super admin dashboard data
 * @returns {Promise<Object>} Complete dashboard data
 */
const getSuperAdminDashboardData = async () => {
  try {
    const [
      totalColleges,
      totalDepartments,
      totalMentors,
      totalStudents,
      cgpaChart,
      attendanceChart,
      studentDistribution,
      mentorDistribution,
      arrearStats,
      lowAttendanceCount,
      topStudentsCount,
      topMentors,
      statistics
    ] = await Promise.all([
      getTotalColleges(),
      getTotalDepartments(),
      getTotalMentors(),
      getTotalStudents(),
      getDepartmentCGPA(),
      getDepartmentAttendance(),
      getDepartmentStudentCount(),
      getDepartmentMentorCount(),
      getArrearStats(),
      getLowAttendanceCount(),
      getTopStudentsCount(),
      getTopMentors(),
      getOverallStatistics()
    ]);

    return {
      summary: {
        totalColleges,
        totalDepartments,
        totalMentors,
        totalStudents
      },
      cgpaChart,
      attendanceChart,
      studentDistribution,
      mentorDistribution,
      arrearChart: arrearStats,
      topMentors,
      statistics: {
        ...statistics,
        lowAttendanceCount,
        topStudentsCount
      }
    };
  } catch (error) {
    throw new Error('Error fetching dashboard data: ' + error.message);
  }
};

/**
 * Get HOD dashboard data for a specific department
 * @param {number} departmentId - Department ID from JWT
 * @param {number} collegeId - College ID from JWT
 * @returns {Promise<Object>} Complete HOD dashboard data
 */
const getHODDashboardData = async (departmentId, collegeId) => {
  try {
    // Department-wide metrics
    const [totalStudentsResult] = await pool.query(`
      SELECT COUNT(*) as count
      FROM student s
      INNER JOIN users u ON s.staff_id = u.staff_id
      WHERE u.department_id = ? AND u.college_id = ?
    `, [departmentId, collegeId]);

    const [totalMentorsResult] = await pool.query(`
      SELECT COUNT(*) as count
      FROM users
      WHERE department_id = ? AND college_id = ? AND role IN ('MENTOR', 'HOD')
    `, [departmentId, collegeId]);

    const [avgCGPAResult] = await pool.query(`
      SELECT ROUND(AVG(s.cgpa), 2) as avg_cgpa
      FROM student s
      INNER JOIN users u ON s.staff_id = u.staff_id
      WHERE u.department_id = ? AND u.college_id = ?
    `, [departmentId, collegeId]);

    const [avgAttendanceResult] = await pool.query(`
      SELECT ROUND(AVG(s.attendance), 2) as avg_attendance
      FROM student s
      INNER JOIN users u ON s.staff_id = u.staff_id
      WHERE u.department_id = ? AND u.college_id = ?
    `, [departmentId, collegeId]);

    const [arrearsResult] = await pool.query(`
      SELECT COUNT(*) as count
      FROM student s
      INNER JOIN users u ON s.staff_id = u.staff_id
      WHERE u.department_id = ? AND u.college_id = ? AND s.pending_arrears > 0
    `, [departmentId, collegeId]);

    const [highPerformersResult] = await pool.query(`
      SELECT COUNT(*) as count
      FROM student s
      INNER JOIN users u ON s.staff_id = u.staff_id
      WHERE u.department_id = ? AND u.college_id = ? AND s.cgpa >= 8.5
    `, [departmentId, collegeId]);

    const [placementReadyResult] = await pool.query(`
      SELECT COUNT(*) as count
      FROM student s
      INNER JOIN users u ON s.staff_id = u.staff_id
      WHERE u.department_id = ? AND u.college_id = ? AND s.cgpa >= 7.5 AND s.pending_arrears = 0
    `, [departmentId, collegeId]);

    // CGPA distribution
    const [cgpaDistribution] = await pool.query(`
      SELECT
        CASE
          WHEN s.cgpa >= 9.0 THEN '9.0+'
          WHEN s.cgpa >= 8.5 THEN '8.5-8.9'
          WHEN s.cgpa >= 8.0 THEN '8.0-8.4'
          WHEN s.cgpa >= 7.5 THEN '7.5-7.9'
          WHEN s.cgpa >= 7.0 THEN '7.0-7.4'
          WHEN s.cgpa >= 6.5 THEN '6.5-6.9'
          ELSE '<6.5'
        END as cgpa_range,
        COUNT(*) as count
      FROM student s
      INNER JOIN users u ON s.staff_id = u.staff_id
      WHERE u.department_id = ? AND u.college_id = ?
      GROUP BY cgpa_range
      ORDER BY cgpa_range DESC
    `, [departmentId, collegeId]);

    // Attendance distribution
    const [attendanceDistribution] = await pool.query(`
      SELECT
        CASE
          WHEN s.attendance >= 95 THEN '95%+'
          WHEN s.attendance >= 90 THEN '90-94%'
          WHEN s.attendance >= 85 THEN '85-89%'
          WHEN s.attendance >= 80 THEN '80-84%'
          WHEN s.attendance >= 75 THEN '75-79%'
          ELSE '<75%'
        END as attendance_range,
        COUNT(*) as count
      FROM student s
      INNER JOIN users u ON s.staff_id = u.staff_id
      WHERE u.department_id = ? AND u.college_id = ?
      GROUP BY attendance_range
      ORDER BY attendance_range DESC
    `, [departmentId, collegeId]);

    // Mentor-wise performance
    const [mentorPerformance] = await pool.query(`
      SELECT
        u.staff_id,
        u.full_name,
        u.designation,
        COUNT(s.register_no) as total_students,
        ROUND(AVG(s.cgpa), 2) as avg_cgpa,
        ROUND(AVG(s.attendance), 2) as avg_attendance,
        SUM(s.pending_arrears) as total_arrears
      FROM users u
      LEFT JOIN student s ON u.staff_id = s.staff_id
      WHERE u.department_id = ? AND u.college_id = ? AND u.role IN ('MENTOR', 'HOD')
      GROUP BY u.staff_id, u.full_name, u.designation
      ORDER BY avg_cgpa DESC
    `, [departmentId, collegeId]);

    // Top performing students
    const [topStudents] = await pool.query(`
      SELECT
        s.register_no,
        s.student_name,
        s.cgpa,
        s.attendance,
        s.pending_arrears,
        u.full_name as mentor_name
      FROM student s
      INNER JOIN users u ON s.staff_id = u.staff_id
      WHERE u.department_id = ? AND u.college_id = ?
      ORDER BY s.cgpa DESC
      LIMIT 10
    `, [departmentId, collegeId]);

    // Students requiring counseling
    const [counselingStudents] = await pool.query(`
      SELECT
        s.register_no,
        s.student_name,
        s.cgpa,
        s.attendance,
        s.pending_arrears,
        u.full_name as mentor_name,
        CASE
          WHEN s.attendance < 75 THEN 'Low Attendance'
          WHEN s.pending_arrears >= 2 THEN 'Multiple Arrears'
          WHEN s.cgpa < 6.5 THEN 'Low CGPA'
          ELSE 'Review Needed'
        END as reason
      FROM student s
      INNER JOIN users u ON s.staff_id = u.staff_id
      WHERE u.department_id = ? AND u.college_id = ?
      AND (s.attendance < 75 OR s.pending_arrears >= 2 OR s.cgpa < 6.5)
      ORDER BY s.pending_arrears DESC, s.attendance ASC, s.cgpa ASC
      LIMIT 20
    `, [departmentId, collegeId]);

    return {
      summary: {
        total_students: totalStudentsResult[0].count || 0,
        total_mentors: totalMentorsResult[0].count || 0,
        avg_cgpa: avgCGPAResult[0].avg_cgpa || 0,
        avg_attendance: avgAttendanceResult[0].avg_attendance || 0,
        students_with_arrears: arrearsResult[0].count || 0,
        high_performers: highPerformersResult[0].count || 0,
        placement_ready: placementReadyResult[0].count || 0
      },
      cgpa_distribution: cgpaDistribution,
      attendance_distribution: attendanceDistribution,
      mentor_performance: mentorPerformance,
      top_students: topStudents,
      counseling_students: counselingStudents
    };
  } catch (error) {
    throw new Error('Error fetching HOD dashboard data: ' + error.message);
  }
};

module.exports = {
  getTotalColleges,
  getTotalDepartments,
  getTotalMentors,
  getTotalStudents,
  getDepartmentCGPA,
  getDepartmentAttendance,
  getDepartmentStudentCount,
  getDepartmentMentorCount,
  getArrearStats,
  getLowAttendanceCount,
  getTopStudentsCount,
  getTopMentors,
  getOverallStatistics,
  getSuperAdminDashboardData,
  getHODDashboardData
};
