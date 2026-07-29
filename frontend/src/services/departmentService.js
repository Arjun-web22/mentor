import api from './api';

/**
 * Get all departments
 * @returns {Promise<Array>} Array of departments
 */
export const getDepartments = async () => {
  try {
    const response = await api.get('/departments');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

/**
 * Get mentors by department ID
 * @param {number} departmentId - Department ID
 * @returns {Promise<Array>} Array of mentors
 */
export const getMentorsByDepartment = async (departmentId) => {
  try {
    const response = await api.get(`/departments/${departmentId}/mentors`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching mentors by department:', error);
    throw error;
  }
};
