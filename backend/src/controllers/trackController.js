const { createClick } = require('../models/clickModel');

const track = async (req, res) => {
  const { featureName } = req.body;
  const userId = req.user.id;

  if (!featureName) {
    return res.status(400).json({ message: 'featureName is required' });
  }

  const allowedFeatures = ['date_filter', 'age_filter', 'gender_filter', 'bar_chart_zoom', 'line_chart_click'];
  if (!allowedFeatures.includes(featureName)) {
    return res.status(400).json({ message: 'Invalid feature name' });
  }

  try {
    const click = await createClick(userId, featureName);
    res.status(201).json({ message: 'Tracked successfully', click });
  } catch (error) {
    console.error('Track error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  track,
};