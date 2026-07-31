-- Mentor Management ERP Database Schema
CREATE DATABASE IF NOT EXISTS mentor_management_erp;
USE mentor_management_erp;

CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    staff_id VARCHAR(20),
    college_id BIGINT UNSIGNED,
    department_id BIGINT UNSIGNED,
    full_name VARCHAR(150) NOT NULL,
    designation VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255),
    role ENUM('SUPER_ADMIN','HOD','MENTOR') NOT NULL,
    profile_photo VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);

CREATE TABLE colleges (
    college_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    college_code VARCHAR(20) UNIQUE NOT NULL,
    college_name VARCHAR(150) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(150),
    logo VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    department_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    college_id BIGINT UNSIGNED NOT NULL,
    department_code VARCHAR(20) NOT NULL,
    department_name VARCHAR(150) NOT NULL,
    abbreviation VARCHAR(20),
    hod_name VARCHAR(150),
    total_students INT DEFAULT 0,
    total_mentors INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE
);

CREATE TABLE mentors (
    mentor_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    college_id BIGINT UNSIGNED NOT NULL,
    department_id BIGINT UNSIGNED NOT NULL,
    employee_code VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    designation VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    profile_photo VARCHAR(255),
    joining_date DATE,
    status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE
);

CREATE TABLE students (
    student_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    register_no VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    college_id BIGINT UNSIGNED NOT NULL,
    department_id BIGINT UNSIGNED NOT NULL,
    staff_id VARCHAR(20) NOT NULL,
    year INT,
    semester INT,
    section VARCHAR(10),
    gender ENUM('Male','Female'),
    dob DATE,
    email VARCHAR(150),
    phone VARCHAR(20),
    profile_photo VARCHAR(255),
    admission_year YEAR,
    cgpa DECIMAL(4,2),
    attendance DECIMAL(5,2),
    pending_arrears INT DEFAULT 0,
    status ENUM('ACTIVE','GRADUATED','DROPPED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE
);

CREATE TABLE subjects (
    subject_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    department_id BIGINT UNSIGNED NOT NULL,
    semester INT NOT NULL,
    subject_code VARCHAR(20) UNIQUE,
    subject_name VARCHAR(150),
    credits INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE
);

CREATE TABLE semester_results (
    result_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    semester INT,
    academic_year VARCHAR(20),
    gpa DECIMAL(4,2),
    cgpa DECIMAL(4,2),
    total_credits INT,
    credits_earned INT,
    result_status ENUM('PASS','FAIL'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE arrears (
    arrear_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    subject_id BIGINT UNSIGNED NOT NULL,
    semester INT,
    status ENUM('PENDING','CLEARED'),
    attempts INT DEFAULT 1,
    cleared_date DATE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- Update attendance table to match backend expectations
CREATE TABLE attendance (
    attendance_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    semester INT,
    working_days INT,
    present_days INT,
    attendance_percentage DECIMAL(5,2),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE mentor_notes (
    note_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    meeting_date DATE,
    remarks TEXT,
    action_plan TEXT,
    next_review_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE rankings (
    ranking_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    academic_year VARCHAR(20),
    semester INT,
    class_rank INT,
    department_rank INT,
    college_rank INT,
    percentile DECIMAL(5,2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE placement (
    placement_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    aptitude_score DECIMAL(5,2),
    coding_score DECIMAL(5,2),
    communication_score DECIMAL(5,2),
    resume_score DECIMAL(5,2),
    overall_score DECIMAL(5,2),
    placement_status ENUM('NOT_ELIGIBLE','ELIGIBLE','PLACED') DEFAULT 'NOT_ELIGIBLE',
    company_name VARCHAR(150),
    package_lpa DECIMAL(5,2),
    interview_date DATE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);
