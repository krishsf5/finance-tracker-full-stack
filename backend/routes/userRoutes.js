const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Placeholder for user-specific routes
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'User dashboard endpoint'
  });
});

module.exports = router;
