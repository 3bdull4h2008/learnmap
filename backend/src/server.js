import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import universityRoutes from './routes/university.js';

dotenv.config();

connectDB();

const app = express();

// Trust reverse proxy headers (Render/Railway/Heroku) so rate limiting
// and secure cookies work correctly behind a proxy
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const wwwroot = path.resolve(__dirname, '..', '..');

// Resolve a request path to a safe absolute file path inside wwwroot.
// Rejects traversal outside wwwroot, dotfiles (e.g. .env) and backend sources.
const resolveSafeStaticPath = (requestPath) => {
  const decoded = decodeURIComponent(requestPath);
  const resolved = path.resolve(path.join(wwwroot, decoded === '/' ? 'index.html' : decoded));
  const relative = path.relative(wwwroot, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  if (relative.split(path.sep).some(seg => seg.startsWith('.'))) return null;
  if (relative === 'backend' || relative.startsWith(`backend${path.sep}`)) return null;
  return resolved;
};

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      frameSrc: ["'self'", "https://accounts.google.com"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Cookie parser
app.use(cookieParser());

// Sanitize data - prevent NoSQL injection
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized ${key} in ${req.method} ${req.path}`);
  }
}));

// Enable CORS
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5000').split(',');
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', apiLimiter);

// Serve static files (only in development or when serving fullstack)
if (process.env.NODE_ENV !== 'production' || process.env.SERVE_STATIC === 'true') {
  app.use(express.static(wwwroot, {
    index: ['index.html', 'index.htm'],
    extensions: ['html', 'htm'],
    setHeaders: function (res, filePath) {
      if (filePath.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript; charset=utf-8');
      }
      if (filePath.endsWith('.css')) {
        res.set('Content-Type', 'text/css; charset=utf-8');
      }
      if (filePath.endsWith('.json')) {
        res.set('Content-Type', 'application/json; charset=utf-8');
      }
    }
  }));
}

// Mount API routers
app.use('/api/auth', authRoutes);
app.use('/api/universities', universityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend config (Google Client ID, etc.)
app.get('/api/config', (req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || ''
  });
});

// SPA fallback - serve index.html for unmatched routes (excluding API)
if (process.env.NODE_ENV !== 'production' || process.env.SERVE_STATIC === 'true') {
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ success: false, message: 'API route not found' });
    }
    const safePath = resolveSafeStaticPath(req.path);
    if (!safePath) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.sendFile(safePath, err => {
      if (err && !res.headersSent) {
        res.sendFile(path.join(wwwroot, 'index.html'));
      }
    });
  });
} else {
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ success: false, message: 'API route not found' });
    }
    res.status(404).json({ success: false, message: 'Not found' });
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err instanceof Error ? err.stack : err}`);
  server.close(() => process.exit(1));
});

export default app;
