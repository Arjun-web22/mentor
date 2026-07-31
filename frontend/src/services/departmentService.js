import api from './api';

/**
 * Get all departments with optional college filtering
 * @param {number|null} collegeId - Optional college ID to filter by
 * @returns {Promise<Array>} Array of departments
 */
export const getDepartments = async (collegeId = null) => {
  try {
    const queryParams = new URLSearchParams();
    if (collegeId) {
      queryParams.append('collegeId', collegeId);
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/departments?${queryString}` : '/departments';
    
    const response = await api.get(url);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

/**
 * Get mentors by department ID with optional college filtering
 * @param {number} departmentId - Department ID
 * @param {number|null} collegeId - Optional college ID to filter by
 * @returns {Promise<Array>} Array of mentors
 */
export const getMentorsByDepartment = async (departmentId, collegeId = null) => {
  try {
    const queryParams = new URLSearchParams();
    if (collegeId) {
      queryParams.append('collegeId', collegeId);
    }
    const queryString = queryParams.toString();
    const url = queryString ? `/departments/${departmentId}/mentors?${queryString}` : `/departments/${departmentId}/mentors`;
    
    const response = await api.get(url);
    console.log("Mentors API Response:", response.data);
    console.log("Mentors Data:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching mentors by department:', error);
    throw error;
  }
};
