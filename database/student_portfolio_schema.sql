-- Student Portfolio Database Schema
-- This file contains normalized tables for student portfolio features

-- 1. Student Personal Information
CREATE TABLE IF NOT EXISTS student_personal_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    register_no VARCHAR(50) NOT NULL UNIQUE,
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other'),
    phone VARCHAR(20),
    personal_email VARCHAR(100),
    alternate_email VARCHAR(100),
    college_email VARCHAR(100),
    blood_group VARCHAR(5),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (register_no) REFERENCES student(register_no) ON DELETE CASCADE
);

-- 2. Student PS Portal Progress
CREATE TABLE IF NOT EXISTS student_ps_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    register_no VARCHAR(50) NOT NULL,
    c_level INT DEFAULT 0,
    java_level INT DEFAULT 0,
    python_level INT DEFAULT 0,
    cpp_level INT DEFAULT 0,
    database_level INT DEFAULT 0,
    aptitude_level INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (register_no) REFERENCES student(register_no) ON DELETE CASCADE,
    UNIQUE KEY (register_no)
);

-- 3. Student Certifications
CREATE TABLE IF NOT EXISTS student_certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    register_no VARCHAR(50) NOT NULL,
    certificate_name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date DATE,
    certificate_link VARCHAR(500),
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (register_no) REFERENCES student(register_no) ON DELETE CASCADE,
    INDEX idx_register_no (register_no),
    INDEX idx_status (status)
);

-- 4. Student Hackathons
CREATE TABLE IF NOT EXISTS student_hackathons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    register_no VARCHAR(50) NOT NULL,
    hackathon_name VARCHAR(255) NOT NULL,
    organizer VARCHAR(255) NOT NULL,
    position VARCHAR(100),
    event_date DATE,
    certificate_link VARCHAR(500),
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (register_no) REFERENCES student(register_no) ON DELETE CASCADE,
    INDEX idx_register_no (register_no),
    INDEX idx_status (status)
);

-- 5. Student Skills
CREATE TABLE IF NOT EXISTS student_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    register_no VARCHAR(50) NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Beginner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (register_no) REFERENCES student(register_no) ON DELETE CASCADE,
    INDEX idx_register_no (register_no)
);

-- 6. Student Coding Profiles
CREATE TABLE IF NOT EXISTS student_coding_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    register_no VARCHAR(50) NOT NULL,
    platform ENUM('LeetCode', 'HackerRank', 'CodeChef', 'Codeforces', 'GitHub', 'LinkedIn', 'Portfolio', 'Other') NOT NULL,
    profile_url VARCHAR(500) NOT NULL,
    username VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (register_no) REFERENCES student(register_no) ON DELETE CASCADE,
    INDEX idx_register_no (register_no),
    UNIQUE KEY (register_no, platform)
);

-- 7. Student Publications
CREATE TABLE IF NOT EXISTS student_publications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    register_no VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    type ENUM('Patent', 'Journal', 'Research Paper', 'Conference') NOT NULL,
    status ENUM('Applied', 'Published', 'Granted') DEFAULT 'Applied',
    publication_date DATE,
    journal_name VARCHAR(255),
    conference_name VARCHAR(255),
    patent_number VARCHAR(100),
    certificate_link VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (register_no) REFERENCES student(register_no) ON DELETE CASCADE,
    INDEX idx_register_no (register_no),
    INDEX idx_status (status)
);

-- 8. Student Lab Assignment
CREATE TABLE IF NOT EXISTS student_lab (
    id INT AUTO_INCREMENT PRIMARY KEY,
    register_no VARCHAR(50) NOT NULL UNIQUE,
    lab_name VARCHAR(255) NOT NULL,
    faculty_in_charge VARCHAR(255),
    lab_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (register_no) REFERENCES student(register_no) ON DELETE CASCADE
);

-- 9. Student Disciplinary Issues
CREATE TABLE IF NOT EXISTS student_disciplinary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    register_no VARCHAR(50) NOT NULL,
    issue VARCHAR(500) NOT NULL,
    severity ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    remarks TEXT,
    issue_date DATE,
    status ENUM('Open', 'Resolved', 'Closed') DEFAULT 'Open',
    reported_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (register_no) REFERENCES student(register_no) ON DELETE CASCADE,
    INDEX idx_register_no (register_no),
    INDEX idx_status (status)
);
