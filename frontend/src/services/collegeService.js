import api from './api';

/**
 * Get all colleges
 * @returns {Promise<Object>} Response with success, count, and data
 */
export const getAllColleges = async () => {
  try {
    console.log("========== COLLEGE SERVICE ==========");
    console.log("Calling GET /api/colleges");
    const response = await api.get('/colleges');
    console.log("RAW AXIOS RESPONSE:", response);
    console.log("response.data:", response.data);
    console.log("response.data.success:", response.data.success);
    console.log("response.data.count:", response.data.count);
    console.log("response.data.data:", response.data.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching colleges:', error);
    throw error;
  }
};
