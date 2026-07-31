const pool = require('./config/db');

async function verifyDatabase() {
  try {
    console.log('=== DATABASE VERIFICATION FOR COLLEGE 2 ===\n');

    // Query 1: Departments for College 2
    console.log('1. Departments for College 2:');
    const [departments] = await pool.query(
      'SELECT * FROM departments WHERE college_id = 2'
    );
    console.log(JSON.stringify(departments, null, 2));
    console.log(`\nTotal departments: ${departments.length}\n`);

    // Query 2: Users (mentors) for College 2
    console.log('2. Users (mentors) for College 2:');
    const [mentors] = await pool.query(
      'SELECT staff_id, full_name, college_id, department_id, role FROM users WHERE college_id = 2 AND role IN ("MENTOR", "HOD")'
    );
    console.log(JSON.stringify(mentors, null, 2));
    console.log(`\nTotal mentors: ${mentors.length}\n`);

    // Query 3: Students for College 2
    console.log('3. Students for College 2:');
    const [students] = await pool.query(
      'SELECT register_no, student_name, staff_id, college_id FROM student WHERE college_id = 2'
    );
    console.log(JSON.stringify(students, null, 2));
    console.log(`\nTotal students: ${students.length}\n`);

    // Query 4: Verify student.staff_id matches users.staff_id
    console.log('4. Student-Staff ID Matching:');
    const [orphanedStudents] = await pool.query(`
      SELECT s.register_no, s.student_name, s.staff_id 
      FROM student s 
      LEFT JOIN users u ON s.staff_id = u.staff_id 
      WHERE s.college_id = 2 AND u.staff_id IS NULL
    `);
    console.log('Orphaned students (staff_id not in users):');
    console.log(JSON.stringify(orphanedStudents, null, 2));
    console.log(`\nOrphaned students count: ${orphanedStudents.length}\n`);

    // Query 5: Verify mentors belong to existing departments
    console.log('5. Mentors with invalid department_id:');
    const [invalidMentors] = await pool.query(`
      SELECT u.staff_id, u.full_name, u.department_id 
      FROM users u 
      WHERE u.college_id = 2 
      AND u.role IN ('MENTOR', 'HOD')
      AND u.department_id NOT IN (SELECT department_id FROM departments WHERE college_id = 2)
    `);
    console.log(JSON.stringify(invalidMentors, null, 2));
    console.log(`\nMentors with invalid department_id: ${invalidMentors.length}\n`);

    // Query 6: All department_ids in College 2
    console.log('6. All department_ids in College 2:');
    const [deptIds] = await pool.query(
      'SELECT department_id, department_name FROM departments WHERE college_id = 2'
    );
    console.log(JSON.stringify(deptIds, null, 2));
    console.log();

    // Query 7: Check what department_ids mentors have
    console.log('7. Department_ids used by mentors in College 2:');
    const [mentorDeptIds] = await pool.query(`
      SELECT DISTINCT u.department_id, d.department_name 
      FROM users u 
      LEFT JOIN departments d ON u.department_id = d.department_id
      WHERE u.college_id = 2 AND u.role IN ('MENTOR', 'HOD')
    `);
    console.log(JSON.stringify(mentorDeptIds, null, 2));
    console.log();

    // Query 8: Check what department_ids students' mentors have
    console.log('8. Department_ids of mentors assigned to students in College 2:');
    const [studentMentorDeptIds] = await pool.query(`
      SELECT DISTINCT u.department_id, d.department_name, COUNT(s.register_no) as student_count
      FROM student s
      INNER JOIN users u ON s.staff_id = u.staff_id
      LEFT JOIN departments d ON u.department_id = d.department_id
      WHERE s.college_id = 2
      GROUP BY u.department_id, d.department_name
    `);
    console.log(JSON.stringify(studentMentorDeptIds, null, 2));
    console.log();

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verifyDatabase();
