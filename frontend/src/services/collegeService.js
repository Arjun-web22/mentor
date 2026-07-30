import api from './api';

/**
 * Get all colleges
 * @returns {Promise<Object>} Response with success, count, and data
 */
export const getAllColleges = async () => {
  try {
    const response = await api.get('/colleges');
    return response.data;
  } catch (error) {
    console.error('Error fetching colleges:', error);
    throw error;
  }
};
