# Module 1 API Testing Guide

## Prerequisites
- Backend server running on http://localhost:5000
- Valid auth tokens for each role

## Test Student Register Numbers
Use existing students from database:
- 95072515001
- 95072515002
- 95072515003

## API Endpoints to Test

### 1. GET Personal Information

**Request:**
```bash
curl -X GET http://localhost:5000/api/students/95072515001/personal-info \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Responses:**
- 200 OK with personal info data (if exists)
- 200 OK with null (if no personal info yet)
- 401 Unauthorized (no token)
- 403 Forbidden (wrong role or not assigned)
- 404 Not Found (student doesn't exist)

### 2. PUT Personal Information

**Request:**
```bash
curl -X PUT http://localhost:5000/api/students/95072515001/personal-info \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date_of_birth": "2000-01-15",
    "gender": "Male",
    "phone": "9876543210",
    "personal_email": "test@gmail.com",
    "college_email": "test@college.edu",
    "blood_group": "O+",
    "address": "123 Test Street"
  }'
```

**Expected Responses:**
- 200 OK with updated data (STUDENT, own profile)
- 403 Forbidden (MENTOR trying to edit)
- 403 Forbidden (HOD trying to edit)
- 403 Forbidden (SUPER_ADMIN trying to edit)
- 403 Forbidden (STUDENT trying to edit another student)

### 3. GET PS Progress

**Request:**
```bash
curl -X GET http://localhost:5000/api/students/95072515001/ps-progress \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Responses:**
- 200 OK with PS progress data (if exists)
- 200 OK with null (if no PS progress yet)
- 401 Unauthorized (no token)
- 403 Forbidden (wrong role or not assigned)

### 4. PUT PS Progress

**Request:**
```bash
curl -X PUT http://localhost:5000/api/students/95072515001/ps-progress \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "c_level": 5,
    "java_level": 4,
    "python_level": 3,
    "cpp_level": 4,
    "database_level": 5,
    "aptitude_level": 6
  }'
```

**Expected Responses:**
- 200 OK with updated data (MENTOR, HOD, SUPER_ADMIN)
- 403 Forbidden (STUDENT trying to edit)
- 403 Forbidden (MENTOR trying to edit unassigned student)

## RBAC Test Matrix

### Student Role
- ✅ GET /personal-info (own)
- ✅ PUT /personal-info (own)
- ❌ GET /personal-info (other student) → 403
- ❌ PUT /personal-info (other student) → 403
- ✅ GET /ps-progress (own)
- ❌ PUT /ps-progress (own) → 403

### Mentor Role
- ✅ GET /personal-info (assigned student)
- ❌ PUT /personal-info (assigned student) → 403
- ❌ GET /personal-info (unassigned student) → 403
- ✅ GET /ps-progress (assigned student)
- ✅ PUT /ps-progress (assigned student)
- ❌ PUT /ps-progress (unassigned student) → 403

### HOD Role
- ✅ GET /personal-info (department student)
- ❌ PUT /personal-info (department student) → 403
- ✅ GET /ps-progress (department student)
- ✅ PUT /ps-progress (department student)

### Super Admin Role
- ✅ GET /personal-info (any student)
- ❌ PUT /personal-info (any student) → 403
- ✅ GET /ps-progress (any student)
- ✅ PUT /ps-progress (any student)

## SQL Verification Queries

### Before Update
```sql
SELECT * FROM student_personal_info WHERE register_no = '95072515001';
SELECT * FROM student_ps_progress WHERE register_no = '95072515001';
```

### After Update
```sql
SELECT * FROM student_personal_info WHERE register_no = '95072515001';
SELECT * FROM student_ps_progress WHERE register_no = '95072515001';
```

### Verify Changes
Compare the results to confirm data persistence.
