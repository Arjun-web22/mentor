-- Module 3: Student Certifications
-- This table stores student certifications with approval workflow

CREATE TABLE IF NOT EXISTS student_certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    register_no VARCHAR(50) NOT NULL,
    certificate_name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    credential_id VARCHAR(100),
    credential_url VARCHAR(500),
    certificate_pdf VARCHAR(500),
    description TEXT,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    mentor_remark TEXT,
    approved_date DATE,
    approved_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (register_no) REFERENCES student(register_no) ON DELETE CASCADE,
    INDEX idx_register_no (register_no),
    INDEX idx_status (status)
);

-- Verify the structure
DESCRIBE student_certifications;
