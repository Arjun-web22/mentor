const pool = require('./config/db');

async function fixHODDepartment() {
  try {
    console.log('Fixing HOD department_id for College 2...\n');
    
    // Update HOD's department_id to 16 (CSE department in College 2)
    const [result] = await pool.query(
      'UPDATE users SET department_id = 16 WHERE staff_id = "MTECCSE001"'
    );
    
    console.log('Update result:', result);
    console.log('HOD department_id fixed to 16\n');
    
    // Verify the update
    const [mentors] = await pool.query(
      'SELECT staff_id, full_name, college_id, department_id FROM users WHERE college_id = 2 AND role IN ("MENTOR", "HOD")'
    );
    
    console.log('Mentors in College 2 after fix:');
    console.log(JSON.stringify(mentors, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixHODDepartment();
