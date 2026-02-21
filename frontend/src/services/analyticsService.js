import api from './api';

export const getBarChartData = (params) => api.get('/analytics', { params });
export const getLineChartData = (feature, params) => api.get('/analytics', { params: { ...params, feature } });