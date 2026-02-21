const express = require('express');
const { track } = require('../controllers/trackController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticate, track);

module.exports = router;