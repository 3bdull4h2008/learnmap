import express from 'express';
import {
  register,
  login,
  googleAuth,
  logout,
  getMe,
  updateProfile,
  updateAvatar,
  saveTestResult,
  getTestResults,
  saveUniversity,
  getSavedUniversities
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  validateRegister,
  validateLogin,
  validateGoogleAuth,
  validateProfile,
  validateTestResult,
  validateAvatar
} from '../middleware/validate.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'عدد محاولات تسجيل الدخول تجاوز الحد المسموح. حاول بعد 15 دقيقة.' },
  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'عدد المحاولات تجاوز الحد المسموح. حاول بعد ساعة.' }
});

router.post('/register', registerLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/google', authLimiter, validateGoogleAuth, googleAuth);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, validateProfile, updateProfile);
router.put('/avatar', protect, validateAvatar, updateAvatar);
router.post('/test-result', protect, validateTestResult, saveTestResult);
router.get('/test-results', protect, getTestResults);
router.post('/save-university', protect, saveUniversity);
router.get('/saved-universities', protect, getSavedUniversities);

export default router;
