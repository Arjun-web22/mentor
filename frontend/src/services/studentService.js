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
 * @param {Object} params - Query parameters
 * @param {number|null} params.departmentId - Optional department ID to filter by
 * @returns {Promise<Object>} Response with success, count, and data
 */
export const getAllStudents = async (params = {}) => {
  try {
    const { departmentId } = params;
    const queryParams = new URLSearchParams();
    if (departmentId) {
      queryParams.append('departmentId', departmentId);
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/students?${queryString}` : '/students';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching all students:', error);
    throw error;
  }
};
