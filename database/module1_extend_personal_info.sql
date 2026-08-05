-- Module 1: Extend Student Personal Information
-- This script adds new fields to the existing student_personal_info table

-- Add new fields to student_personal_info
ALTER TABLE student_personal_info
ADD COLUMN alternate_email VARCHAR(100) AFTER personal_email,
ADD COLUMN city VARCHAR(100) AFTER address,
ADD COLUMN state VARCHAR(100) AFTER city,
ADD COLUMN country VARCHAR(100) AFTER state,
ADD COLUMN pincode VARCHAR(20) AFTER country;

-- Verify the structure
DESCRIBE student_personal_info;
