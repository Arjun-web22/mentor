import axios from 'axios';
import { mockColleges, mockDepartments, mockMentors, mockStudents } from './mockData';
// Create custom Axios Instance
export const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-Institutional-Portal': 'FXEC-Academic-Mentor-v2',
  },
});

// Memory storage for live state changes
let studentsList = [...mockStudents];

// Mock HTTP API methods
export const apiService = {
  // Students
  getStudents: async (params) => {
    let result = [...studentsList];

    if (params?.departmentId && params.departmentId !== 'all') {
      result = result.filter((s) => s.departmentId === params.departmentId);
    }

    if (params?.search) {
      const query = params.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.registerNo.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query)
      );
    }

    if (params?.arrearsFilter) {
      if (params.arrearsFilter === 'zero') {
        result = result.filter((s) => s.pendingArrearsCount === 0);
      } else if (params.arrearsFilter === 'pending') {
        result = result.filter((s) => s.pendingArrearsCount > 0);
      } else if (params.arrearsFilter === 'cleared') {
        result = result.filter((s) => s.totalHistoryArrearsCount > 0 && s.pendingArrearsCount === 0);
      }
    }

    if (params?.placementFilter && params.placementFilter !== 'all') {
      result = result.filter((s) => s.placementStatus === params.placementFilter);
    }

    if (params?.sortBy) {
      if (params.sortBy === 'rank') {
        result.sort((a, b) => a.departmentRank - b.departmentRank);
      } else if (params.sortBy === 'cgpa_desc') {
        result.sort((a, b) => b.cgpa - a.cgpa);
      } else if (params.sortBy === 'attendance_desc') {
        result.sort((a, b) => b.attendancePercentage - a.attendancePercentage);
      } else if (params.sortBy === 'arrears_desc') {
        result.sort((a, b) => b.pendingArrearsCount - a.pendingArrearsCount);
      }
    }

    return Promise.resolve(result);
  },

  getStudentById: async (id) => {
    const student = studentsList.find((s) => s.id === id || s.registerNo === id);
    return Promise.resolve(student);
  },

  addCounselingNote: async (
    studentId,
    noteData
  ) => {
    const newNote = {
      ...noteData,
      id: `cn-${Date.now()}`,
    };

    studentsList = studentsList.map((student) => {
      if (student.id === studentId) {
        return {
          ...student,
          counselingNotes: [newNote, ...student.counselingNotes],
        };
      }
      return student;
    });

    return Promise.resolve(newNote);
  },

  updateStudentRemarks: async (studentId, remarks) => {
    let updatedStudent;
    studentsList = studentsList.map((s) => {
      if (s.id === studentId) {
        updatedStudent = { ...s, mentorRemarks: remarks };
        return updatedStudent;
      }
      return s;
    });
    return Promise.resolve(updatedStudent);
  },

  // Mentors
  getMentors: async () => {
    return Promise.resolve(mockMentors);
  },

  // Departments
  getDepartments: async () => {
    return Promise.resolve(mockDepartments);
  },

  // Colleges
  getColleges: async () => {
    return Promise.resolve(mockColleges);
  },
};
