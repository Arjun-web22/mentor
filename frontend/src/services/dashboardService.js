import api from './api';

/**
 * Get super admin dashboard data
 * @returns {Promise<Object>} Dashboard data object
 */
export const getSuperAdminDashboard = async () => {
  try {
    const response = await api.get('/dashboard/super-admin');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching super admin dashboard:', error);
    throw error;
  }
};
