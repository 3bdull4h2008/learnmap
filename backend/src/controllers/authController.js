import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        profile: user.profile
      }
    });
};

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

export const register = async (req, res, next) => {
  try {
    const name = sanitizeString(req.body.name);
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password;

    if (!name || name.length < 2) {
      return res.status(400).json({ success: false, message: 'الاسم مطلوب ويجب أن يكون 2 أحرف على الأقل' });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني غير صالح' });
    }

    if (!password || password.length < 6 || password.length > 128) {
      return res.status(400).json({ success: false, message: 'كلمة المرور يجب أن تكون بين 6 و 128 حرف' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'هذا البريد الإلكتروني مسجل بالفعل' });
    }

    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'هذا البريد الإلكتروني مسجل بالفعل' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(err.errors)[0]?.message || 'بيانات غير صالحة' });
    }
    const msg = err.name === 'MongooseError' || err.name === 'MongooseServerSelectionError'
      ? 'تعذر الاتصال بقاعدة البيانات. تأكد من تشغيل MongoDB.'
      : 'حدث خطأ في الخادم. حاول مرة أخرى لاحقاً.';
    res.status(500).json({ success: false, message: msg });
  }
};

export const login = async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    user.lastLogin = Date.now();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    const msg = err.name === 'MongooseError' || err.name === 'MongooseServerSelectionError'
      ? 'تعذر الاتصال بقاعدة البيانات. تأكد من تشغيل MongoDB.'
      : 'حدث خطأ في الخادم. حاول مرة أخرى لاحقاً.';
    res.status(500).json({ success: false, message: msg });
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({ success: false, message: 'Google credential مطلوب' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture;
        await user.save();
      }
    } else {
      user = await User.create({
        googleId,
        email,
        name: sanitizeString(name) || email.split('@')[0],
        avatar: picture,
        password: crypto.randomBytes(24).toString('hex')
      });
    }

    user.lastLogin = Date.now();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Google auth error:', err.message);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'هذا البريد الإلكتروني مسجل بالفعل' });
    }
    const msg = err.name === 'MongooseError' || err.name === 'MongooseServerSelectionError'
      ? 'تعذر الاتصال بقاعدة البيانات. تأكد من تشغيل MongoDB.'
      : 'فشل تسجيل الدخول عبر Google. قد يكون معرف العميل (Client ID) غير صحيح.';
    res.status(500).json({ success: false, message: msg });
  }
};

export const logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    if (req.body.name) fieldsToUpdate.name = sanitizeString(req.body.name);
    if (req.body.profile) fieldsToUpdate.profile = req.body.profile;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' });
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    if (!avatar || typeof avatar !== 'string') {
      return res.status(400).json({ success: false, message: 'صورة الملف الشخصي مطلوبة' });
    }
    if (avatar.length > 500000) {
      return res.status(400).json({ success: false, message: 'حجم الصورة كبير جداً' });
    }
    if (!avatar.match(/^data:image\/(jpeg|png|webp);base64,/)) {
      return res.status(400).json({ success: false, message: 'صيغة الصورة غير مدعومة' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true }
    );
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' });
  }
};

export const saveTestResult = async (req, res, next) => {
  try {
    const { testType, results } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.testResults) user.testResults = {};

    user.testResults[testType] = {
      ...results,
      completedAt: new Date()
    };

    await user.save();
    res.status(200).json({ success: true, data: user.testResults });
  } catch (err) {
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' });
  }
};

export const getTestResults = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user.testResults });
  } catch (err) {
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' });
  }
};

export const saveUniversity = async (req, res, next) => {
  try {
    const { universityId, majorId } = req.body;
    if (!universityId || !majorId || typeof majorId !== 'string' ||
        !/^[a-f\d]{24}$/i.test(universityId)) {
      return res.status(400).json({ success: false, message: 'معرف الجامعة والتخصص غير صالح' });
    }

    const user = await User.findById(req.user.id);

    const exists = user.savedUniversities.some(
      item => item.universityId.toString() === universityId && item.majorId === majorId
    );

    if (!exists) {
      user.savedUniversities.push({ universityId, majorId });
      await user.save();
    }

    res.status(200).json({ success: true, data: user.savedUniversities });
  } catch (err) {
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' });
  }
};

export const getSavedUniversities = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('savedUniversities.universityId');
    res.status(200).json({ success: true, data: user.savedUniversities });
  } catch (err) {
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' });
  }
};
