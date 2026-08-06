# Module 1 Runtime Testing Checklist

## Pre-Testing Setup

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Verify: Server running on http://localhost:5000

2. **Start Frontend Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Verify: Frontend running on http://localhost:5174

3. **Database Verification**
   ```sql
   -- Check tables exist
   SHOW TABLES LIKE 'student_%';
   
   -- Check structure
   DESCRIBE student_personal_info;
   DESCRIBE student_ps_progress;
   ```

---

## Phase 1: Student Login Testing

### Login as Student
- Use a student account (register_no: 95072515001 or similar)
- Navigate to Student Profile

### Personal Information Tests
- [ ] Personal Information section loads
- [ ] All fields display "N/A" if no data exists
- [ ] Edit button is visible
- [ ] Click Edit → Form appears with all fields
- [ ] Fill in: Date of Birth, Gender, Phone, Personal Email, College Email, Blood Group, Address
- [ ] Click Save → Data saves, form closes
- [ ] Refresh page → Data persists
- [ ] Click Edit → Modify a field → Click Cancel → Original values restored
- [ ] Try empty fields → Validation handles gracefully
- [ ] Loading spinner appears during save
- [ ] Error message displays if save fails

### PS Progress Tests
- [ ] PS Progress section loads
- [ ] All 6 cards display (C, Java, Python, C++, Database, Aptitude)
- [ ] Levels show "Level 0" if no data exists
- [ ] Edit button is NOT visible (students cannot edit PS progress)

### Security Tests
- [ ] Try to access another student's profile → 403 error
- [ ] Try to edit another student's personal info → 403 error
- [ ] Try to update PS progress → 403 error

---

## Phase 2: Mentor Login Testing

### Login as Mentor
- Use mentor account (e.g., FXEET007)
- Navigate to Student Directory
- Open an assigned student's profile

### Personal Information Tests
- [ ] Personal Information section loads
- [ ] Edit button is NOT visible
- [ ] All fields are read-only
- [ ] Try to edit via API → 403 error

### PS Progress Tests
- [ ] PS Progress section loads
- [ ] Edit button is visible (if we add edit UI for mentors)
- [ ] Can update PS progress levels
- [ ] Save updates database
- [ ] Student sees updated levels after refresh

### Security Tests
- [ ] Try to access unassigned student → 403 error
- [ ] Try to edit personal info → 403 error
- [ ] Try to update PS progress for unassigned student → 403 error

---

## Phase 3: HOD Login Testing

### Login as HOD
- Use HOD account
- Navigate to Department students

### Personal Information Tests
- [ ] Can view department students' personal info
- [ ] Edit button is NOT visible
- [ ] All fields are read-only

### PS Progress Tests
- [ ] Can view department students' PS progress
- [ ] Can update PS progress
- [ ] Updates persist

### Security Tests
- [ ] Cannot edit personal info → 403 error
- [ ] Cannot access other department students → 403 error

---

## Phase 4: Super Admin Login Testing

### Login as Super Admin
- Use Super Admin account (velmurugan@francisxavier.ac.in)
- Navigate to any student profile

### Personal Information Tests
- [ ] Can view any student's personal info
- [ ] Edit button is NOT visible
- [ ] All fields are read-only

### PS Progress Tests
- [ ] Can view any student's PS progress
- [ ] Can update PS progress
- [ ] Updates persist

### Security Tests
- [ ] Cannot edit personal info → 403 error

---

## Phase 5: API Testing (Postman/curl)

Use the API_TEST_GUIDE.md for detailed curl commands.

### GET /api/students/:registerNo/personal-info
- [ ] 200 OK with data (valid token, authorized)
- [ ] 200 OK with null (no personal info yet)
- [ ] 401 Unauthorized (no token)
- [ ] 403 Forbidden (wrong role)
- [ ] 404 Not Found (invalid register_no)

### PUT /api/students/:registerNo/personal-info
- [ ] 200 OK (STUDENT, own profile)
- [ ] 403 Forbidden (MENTOR)
- [ ] 403 Forbidden (HOD)
- [ ] 403 Forbidden (SUPER_ADMIN)
- [ ] 403 Forbidden (STUDENT, other student)

### GET /api/students/:registerNo/ps-progress
- [ ] 200 OK with data (valid token, authorized)
- [ ] 200 OK with null (no PS progress yet)
- [ ] 401 Unauthorized (no token)
- [ ] 403 Forbidden (wrong role)

### PUT /api/students/:registerNo/ps-progress
- [ ] 200 OK (MENTOR, HOD, SUPER_ADMIN)
- [ ] 403 Forbidden (STUDENT)
- [ ] 403 Forbidden (MENTOR, unassigned student)

---

## Phase 6: Database Verification

### Before Update
```sql
SELECT * FROM student_personal_info WHERE register_no = '95072515001';
SELECT * FROM student_ps_progress WHERE register_no = '95072515001';
```
Record the values.

### After Update
```sql
SELECT * FROM student_personal_info WHERE register_no = '95072515001';
SELECT * FROM student_ps_progress WHERE register_no = '95072515001';
```
Verify values changed correctly.

---

## Phase 7: UI Verification

### Desktop (1920x1080)
- [ ] No layout shifts
- [ ] No horizontal scrollbars
- [ ] Cards align properly
- [ ] Forms are responsive

### Tablet (768x1024)
- [ ] Cards stack vertically
- [ ] Form fields are touch-friendly
- [ ] No overflow issues

### Mobile (375x667)
- [ ] Single column layout
- [ ] Touch targets are 44px minimum
- [ ] No horizontal scrolling
- [ ] Text is readable

### Browser Console
- [ ] No errors
- [ ] No React warnings
- [ ] No network errors

---

## Phase 8: Regression Testing

### Mentor Dashboard
- [ ] Loads correctly
- [ ] Student list displays
- [ ] Navigation works

### HOD Dashboard
- [ ] Loads correctly
- [ ] Department stats display
- [ ] Navigation works

### Super Admin Dashboard
- [ ] Loads correctly
- [ ] All stats display
- [ ] Navigation works

### Student Directory
- [ ] Loads correctly
- [ ] Search/filter works
- [ ] Student profiles open

### Mentor Directory
- [ ] Loads correctly
- [ ] Mentor profiles open
- [ ] Navigation works

### Department Directory
- [ ] Loads correctly
- [ ] Department details display

### Login
- [ ] All roles can login
- [ ] Authentication works
- [ ] Session persists

### Existing APIs
- [ ] All existing endpoints work
- [ ] No breaking changes

---

## Phase 9: Security Verification

### Forbidden Actions (All Should Return 403)
- [ ] Student edits another student's personal info
- [ ] Student updates PS progress
- [ ] Mentor edits personal info
- [ ] HOD edits personal info
- [ ] Super Admin edits personal info
- [ ] Mentor edits unassigned student's PS progress

---

## Phase 10: Code Quality

### Console Logs
- [ ] No console.log statements in production code
- [ ] No debugging code
- [ ] No commented code

### Imports
- [ ] All imports are used
- [ ] No unused imports

### Code Style
- [ ] Consistent naming
- [ ] Proper indentation
- [ ] No dead code

---

## Test Results Summary

### Bugs Found
- List any bugs discovered during testing

### Issues Fixed
- List any issues fixed during testing

### Files Modified
- List any files modified during testing

### Production Ready
- [ ] Yes / No

### Notes
- Any additional notes or observations
