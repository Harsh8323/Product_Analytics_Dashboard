import api from './api';

export const trackClick = (featureName) => api.post('/track', { featureName });