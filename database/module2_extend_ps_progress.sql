-- Module 2: Extend PS Portal Progress
-- This script adds completed_date and verified_by fields for each skill level

-- Add completed_date and verified_by for each skill
ALTER TABLE student_ps_progress
ADD COLUMN c_completed_date DATE AFTER c_level,
ADD COLUMN c_verified_by VARCHAR(100) AFTER c_completed_date,
ADD COLUMN java_completed_date DATE AFTER java_level,
ADD COLUMN java_verified_by VARCHAR(100) AFTER java_completed_date,
ADD COLUMN python_completed_date DATE AFTER python_level,
ADD COLUMN python_verified_by VARCHAR(100) AFTER python_completed_date,
ADD COLUMN cpp_completed_date DATE AFTER cpp_level,
ADD COLUMN cpp_verified_by VARCHAR(100) AFTER cpp_completed_date,
ADD COLUMN database_completed_date DATE AFTER database_level,
ADD COLUMN database_verified_by VARCHAR(100) AFTER database_completed_date,
ADD COLUMN aptitude_completed_date DATE AFTER aptitude_level,
ADD COLUMN aptitude_verified_by VARCHAR(100) AFTER aptitude_completed_date;

-- Verify the structure
DESCRIBE student_ps_progress;
