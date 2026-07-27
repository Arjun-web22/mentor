export type FontScale = 'normal' | 'large' | 'xlarge';

export type ArrearStatus = 'passed_first_attempt' | 'passed_arrear' | 'pending';

export interface ArrearItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  status: ArrearStatus;
  attemptCount: number;
  grade?: string;
  clearingSemester?: number;
}

export type PlacementStatus =
  | 'eligible_placed'
  | 'eligible_unplaced'
  | 'ineligible_arrears'
  | 'opted_higher_studies';

export interface CounselingNote {
  id: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  mentorName: string;
  date: string;
  category: 'Academic' | 'Attendance' | 'Personal' | 'Placement' | 'General';
  note: string;
  actionPlan: string;
  followUpDate: string;
}

export interface Student {
  id: string;
  registerNo: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  collegeId: string;
  collegeName: string;
  departmentId: string;
  departmentName: string;
  year: number; // 1, 2, 3, 4
  semester: number; // 1 - 8
  section: string; // 'A', 'B', 'C'
  cgpa: number;
  gpaHistory: { semester: number; gpa: number; cgpa: number }[];
  arrearsHistory: ArrearItem[];
  pendingArrearsCount: number;
  totalHistoryArrearsCount: number;
  attendancePercentage: number;
  collegeRank: number;
  departmentRank: number;
  classRank: number;
  batchRank: number;
  percentile: number;
  placementStatus: PlacementStatus;
  companyName?: string;
  packageCtc?: string; // e.g. "6.5 LPA"
  skills: string[];
  certifications: string[];
  projects: { title: string; tech: string; description: string }[];
  hackathons: { name: string; position: string; year: string }[];
  internships: { company: string; role: string; duration: string }[];
  interviewReadinessScore: number; // 0 - 100
  mentorId: string;
  mentorName: string;
  mentorRemarks: string;
  counselingNotes: CounselingNote[];
  notifications: NotificationItem[];
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  email: string;
  phone: string;
  avatar: string;
  assignedStudentCount: number;
  avgCgpa: number;
  successRate: number;
  officeHours: string;
  roomNo: string;
}

export interface Department {
  id: string;
  code: string; // CSE, IT, MECH, ECE, EEE, CIVIL, MBA, AI&DS
  name: string;
  hodName: string;
  hodEmail: string;
  hodPhone: string;
  studentsCount: number;
  mentorsCount: number;
  avgCgpa: number;
  placementPercentage: number;
  pendingArrearsCount: number;
  iconName: string;
}

export interface College {
  id: string;
  code: string;
  name: string;
  region: string;
  status: 'Active' | 'Inactive' | 'Under Audit';
  departmentsCount: number;
  studentsCount: number;
  mentorsCount: number;
  hodName: string;
  naacGrade: string;
  establishedYear: number;
}

export interface NotificationItem {
  id: string;
  studentId: string;
  studentName: string;
  type: 'low_cgpa' | 'multiple_arrears' | 'low_attendance' | 'placement_ready';
  message: string;
  date: string;
  read: boolean;
  severity: 'danger' | 'warning' | 'info' | 'success';
}

export type UserRole = 'super_admin' | 'hod' | 'mentor';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  departmentId?: string;
  departmentName?: string;
  mentorId?: string;
  avatar: string;
}
