import api from './api';

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Response with success, token, and user data
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

/**
 * Login user with Google OAuth
 * @param {string} credential - Google ID token
 * @returns {Promise<Object>} Response with success, token, and user data
 */
export const googleLogin = async (credential) => {
  try {
    const response = await api.post('/auth/google', { credential });
    return response.data;
  } catch (error) {
    console.error('Error during Google login:', error);
    throw error;
  }
};
