import api from './api';

/**
 * Get all mentors
 * @returns {Promise<Array>} Array of mentor objects
 */
export const getAllMentors = async () => {
  try {
    const response = await api.get('/mentors');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all mentors:', error);
    throw error;
  }
};

/**
 * Get mentor by ID
 * @param {number} mentorId - Mentor user ID
 * @returns {Promise<Object>} Mentor object
 */
export const getMentorById = async (mentorId) => {
  try {
    const response = await api.get(`/mentors/${mentorId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching mentor:', error);
    throw error;
  }
};

/**
 * Get students by mentor ID (placeholder)
 * @param {number} mentorId - Mentor user ID
 * @returns {Promise<Object>} Students data or placeholder message
 */
export const getStudentsByMentor = async (mentorId) => {
  try {
    const response = await api.get(`/mentors/${mentorId}/students`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching students by mentor:', error);
    throw error;
  }
};
