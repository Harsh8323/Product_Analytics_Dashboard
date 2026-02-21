const { getTotalClicksPerFeature, getDailyClicksForFeature } = require('../models/clickModel');
const { buildAnalyticsWhereClause } = require('../utils/queryUtils');

const getAnalytics = async (req, res) => {
  const { startDate, endDate, ageGroup, gender, feature } = req.query;

  try {
    if (feature) {
      const filters = { startDate, endDate, ageGroup, gender };
      const dailyData = await getDailyClicksForFeature(feature, filters);
      return res.json({ type: 'line', feature, data: dailyData });
    } else {
      const filters = { startDate, endDate, ageGroup, gender };
      const barData = await getTotalClicksPerFeature(filters);
      return res.json({ type: 'bar', data: barData });
    }
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAnalytics,
};