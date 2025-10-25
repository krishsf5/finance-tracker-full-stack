const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updatePassword,
  forgotPassword,
  resetPassword,
  updateProfile,
  deleteAccount
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.use(protect); // All routes below this middleware are protected

router.get('/me', getMe);
router.put('/update-profile', validateUserUpdate, updateProfile);
router.put('/update-password', updatePassword);
router.post('/logout', logout);
router.delete('/delete-account', deleteAccount);

module.exports = router;
