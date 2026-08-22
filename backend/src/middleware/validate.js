import { body, query, param, validationResult } from 'express-validator';

const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map(e => e.msg).join(', ');
    return res.status(400).json({ success: false, message: msg });
  }
  next();
};

export const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('الاسم يجب أن يكون بين 2 و 100 حرف')
    .matches(/^[\u0600-\u06FFa-zA-Z\s.'-]+$/).withMessage('الاسم يحتوي على أحرف غير مسموحة'),
  body('email')
    .trim()
    .isEmail().withMessage('البريد الإلكتروني غير صالح')
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage('البريد الإلكتروني طويل جداً'),
  body('password')
    .isLength({ min: 6, max: 128 }).withMessage('كلمة المرور يجب أن تكون بين 6 و 128 حرف'),
  handleErrors
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('البريد الإلكتروني غير صالح')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('كلمة المرور مطلوبة')
    .isLength({ max: 128 }).withMessage('كلمة المرور طويلة جداً'),
  handleErrors
];

export const validateGoogleAuth = [
  body('credential')
    .trim()
    .notEmpty().withMessage('Google credential مطلوب')
    .isLength({ max: 2048 }).withMessage('Credential غير صالح'),
  handleErrors
];

export const validateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('الاسم يجب أن يكون بين 2 و 100 حرف'),
  body('profile.tawjihiMark')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('المعدّل يجب أن يكون بين 0 و 100'),
  body('profile.age')
    .optional()
    .isInt({ min: 10, max: 100 }).withMessage('العمر غير صالح'),
  handleErrors
];

export const validateTestResult = [
  body('testType')
    .trim()
    .isIn(['interestTest', 'fieldTest', 'universityMatcher']).withMessage('نوع الاختبار غير صالح'),
  body('results')
    .isObject().withMessage('النتائج يجب أن تكون كائناً'),
  handleErrors
];

export const validateUniversityQuery = [
  query('location')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('اسم المدينة طويل جداً')
    .matches(/^[a-zA-Z\u0600-\u06FF\s-]+$/).withMessage('اسم المدينة يحتوي على أحرف غير مسموحة'),
  query('type')
    .optional()
    .isIn(['public', 'private', 'special-law', 'colleges', 'hospital', 'international']).withMessage('نوع الجامعة غير صالح'),
  query('field')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('اسم المجال طويل جداً')
    .matches(/^[a-zA-Z\u0600-\u06FF-]+$/).withMessage('اسم المجال يحتوي على أحرف غير مسموحة'),
  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage('رقم الصفحة غير صالح'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 200 }).withMessage('عدد النتائج غير صالح'),
  handleErrors
];

export const validateMatch = [
  body('tawjihiMark')
    .isFloat({ min: 0, max: 100 }).withMessage('المعدّل التوجيهي مطلوب ويجب أن يكون بين 0 و 100'),
  body('budget')
    .optional()
    .isFloat({ min: 0, max: 50000 }).withMessage('الميزانية غير صالحة'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('اسم المدينة طويل جداً'),
  body('interestField')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('اسم المجال طويل جداً'),
  body('majorName')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('اسم التخصص طويل جداً'),
  body('path')
    .optional()
    .isIn(['academic', 'vocational']).withMessage('المسار غير صالح'),
  handleErrors
];

export const validateAvatar = [
  body('avatar')
    .trim()
    .notEmpty().withMessage('صورة الملف الشخصي مطلوبة')
    .isLength({ max: 500000 }).withMessage('حجم الصورة كبير جداً (الحد الأقصى 500KB)')
    .matches(/^data:image\/(jpeg|png|webp);base64,/).withMessage('صيغة الصورة غير مدعومة (يدعم JPEG, PNG, WebP)'),
  handleErrors
];

export const validateUniversityId = [
  param('id')
    .isMongoId().withMessage('معرف الجامعة غير صالح'),
  handleErrors
];
