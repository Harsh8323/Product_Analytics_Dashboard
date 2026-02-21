const express = require('express');
const authRoutes = require('./authRoutes');
const trackRoutes = require('./trackRoutes');
const analyticsRoutes = require('./analyticsRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/track', trackRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;