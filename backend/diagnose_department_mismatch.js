/**
 * Read-only diagnostic: finds staff (MENTOR/HOD) whose staff_id appears to
 * encode a department abbreviation that DOES NOT match the department_name
 * currently assigned to them via department_id.
 *
 * This does NOT modify any data. It only prints a report.
 *
 * Usage (from the backend folder, where node_modules / .env already exist):
 *   node diagnose_department_mismatch.js
 */
const pool = require('./config/db');

async function diagnose() {
  try {
    const [users] = await pool.query(`
      SELECT u.staff_id, u.full_name, u.role, u.college_id, u.department_id,
             d.department_name, d.abbreviation, d.department_code
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.department_id
      WHERE u.role IN ('MENTOR', 'HOD')
      ORDER BY u.college_id, u.department_id, u.staff_id
    `);

    const [departments] = await pool.query(
      `SELECT department_id, college_id, department_name, abbreviation, department_code FROM departments`
    );

    console.log(`\nTotal staff (MENTOR/HOD): ${users.length}`);
    console.log(`Total departments: ${departments.length}\n`);

    console.log('=== Full staff -> department mapping ===');
    console.table(
      users.map(u => ({
        staff_id: u.staff_id,
        name: u.full_name,
        role: u.role,
        college_id: u.college_id,
        department_id: u.department_id,
        assigned_department: u.department_name || '⚠ NO MATCH / NULL',
        abbreviation: u.abbreviation || ''
      }))
    );

    // Heuristic check: does staff_id contain the abbreviation of a DIFFERENT
    // department (for the same college) rather than its assigned one?
    console.log('\n=== Possible mismatches (staff_id suggests a different department) ===');
    let suspiciousCount = 0;

    for (const u of users) {
      const idUpper = (u.staff_id || '').toUpperCase();
      const assignedAbbr = (u.abbreviation || '').toUpperCase();

      // Departments in the same college whose abbreviation appears in the staff_id
      const candidateDepts = departments.filter(
        d => d.college_id === u.college_id &&
             d.abbreviation &&
             idUpper.includes(d.abbreviation.toUpperCase())
      );

      const matchesAssigned = candidateDepts.some(d => d.department_id === u.department_id);
      const matchesSomethingElse = candidateDepts.filter(d => d.department_id !== u.department_id);

      if (candidateDepts.length > 0 && !matchesAssigned && matchesSomethingElse.length > 0) {
        suspiciousCount++;
        console.log(
          `⚠ ${u.staff_id} (${u.full_name}) is assigned to "${u.department_name}" ` +
          `(department_id=${u.department_id}), but staff_id suggests: ` +
          matchesSomethingElse.map(d => `"${d.department_name}" (department_id=${d.department_id})`).join(' or ')
        );
      }
    }

    if (suspiciousCount === 0) {
      console.log('None found by the staff_id heuristic. (This heuristic only catches staff_id patterns like "...CSE...", "...MECH...", etc. It will miss mismatches that don\'t follow a naming convention.)');
    }

    console.log(`\nTotal suspicious rows: ${suspiciousCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Error running diagnostic:', error);
    process.exit(1);
  }
}

diagnose();
