import api from './api';

/**
 * Get students for a specific mentor
 * @param {string} staffId - Mentor staff_id
 * @returns {Promise<Object>} Response with success, count, and data
 */
export const getMentorStudents = async (staffId) => {
  try {
    const response = await api.get(`/mentors/${staffId}/students`);
    return response.data;
  } catch (error) {
    console.error('Error fetching mentor students:', error);
    throw error;
  }
};

/**
 * Get student by register number
 * @param {string} registerNo - Student register number
 * @returns {Promise<Object>} Response with success and data
 */
export const getStudentByRegisterNo = async (registerNo) => {
  try {
    const response = await api.get(`/students/${registerNo}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};

/**
 * Update student information
 * @param {string} registerNo - Student register number
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Response with success, message, and data
 */
export const updateStudent = async (registerNo, updateData) => {
  try {
    const response = await api.put(`/students/${registerNo}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

/**
 * Get all students
 * @returns {Promise<Object>} Response with success, count, and data
 */
export const getAllStudents = async () => {
  try {
    const response = await api.get('/students');
    return response.data;
  } catch (error) {
    console.error('Error fetching all students:', error);
    throw error;
  }
};
