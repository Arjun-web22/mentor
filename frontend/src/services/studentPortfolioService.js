import api from './api';

/**
 * Student Personal Information API
 */

export const getPersonalInfo = async (registerNo) => {
  const response = await api.get(`/students/${registerNo}/personal-info`);
  return response.data.data;
};

export const updatePersonalInfo = async (registerNo, data) => {
  const response = await api.put(`/students/${registerNo}/personal-info`, data);
  return response.data.data;
};

/**
 * Student PS Progress API
 */

export const getPSProgress = async (registerNo) => {
  const response = await api.get(`/students/${registerNo}/ps-progress`);
  return response.data.data;
};

export const updatePSProgress = async (registerNo, data) => {
  const response = await api.put(`/students/${registerNo}/ps-progress`, data);
  return response.data.data;
};

/**
 * Student Certifications API
 */

export const getCertifications = async (registerNo) => {
  const response = await api.get(`/students/${registerNo}/certifications`);
  return response.data.data;
};

export const createCertification = async (registerNo, data) => {
  const response = await api.post(`/students/${registerNo}/certifications`, data);
  return response.data.data;
};

export const updateCertification = async (registerNo, id, data) => {
  const response = await api.put(`/students/${registerNo}/certifications/${id}`, data);
  return response.data.data;
};

export const deleteCertification = async (registerNo, id) => {
  const response = await api.delete(`/students/${registerNo}/certifications/${id}`);
  return response.data.data;
};

export const approveCertification = async (registerNo, id, remark = null) => {
  const response = await api.put(`/students/${registerNo}/certifications/${id}/approve`, { remark });
  return response.data.data;
};

export const rejectCertification = async (registerNo, id, remark) => {
  const response = await api.put(`/students/${registerNo}/certifications/${id}/reject`, { remark });
  return response.data.data;
};
