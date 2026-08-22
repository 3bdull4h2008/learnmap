# LearnMap | خريطة التعلّم

منصة توجيه تعليمي ومهني للطلبة الأردنيين: استكشاف المسارات الأكاديمية والمهنية، اختبارات الميول والمهارات، مطابقة الجامعات والتخصصات، المنح، وقرارات وزارة التربية والتعليم.

An educational & career-guidance platform for Jordanian students — field awareness, interest/skills tests, a university matcher, scholarships, and ministry decisions. Built as a static multilingual-ready (Arabic RTL) frontend backed by a Node.js/Express + MongoDB API.

## Features

- **Field Awareness** — academic & vocational (BTEC) paths, majors, labor-market needs
- **Career Guidance** — interest test, vocational field test, university matcher
- **University Directory** — Jordanian universities, majors, admission info
- **Community** — scholarships and ministry decisions
- **Psychological Support** — time management & mindset tools
- **Auth** — email/password + Google Sign-In, JWT in httpOnly cookies, saved universities & test results per user

## Tech Stack

| Layer     | Technologies                                                              |
| --------- | ------------------------------------------------------------------------- |
| Frontend  | Vanilla HTML/CSS/JS (RTL), static hosting on Netlify                       |
| Backend   | Node.js (ESM), Express, Mongoose (MongoDB)                                 |
| Auth      | JWT + bcryptjs + Google Identity (`google-auth-library`)                   |
| Security  | helmet, express-rate-limit, express-mongo-sanitize, express-validator, CORS allowlist |
| Deploy    | Netlify (site + `/api` proxy to Render), Docker/nginx option included      |

## Project Structure

```
learnmap/
├── index.html               # Landing page
├── About/                   # Vision, mission, team
├── auth/                    # Login / register pages (+ shared auth.js client)
├── backend/                 # Express API
│   ├── src/
│   │   ├── server.js        # App entry — security middleware, routes, static serving
│   │   ├── config/db.js     # MongoDB connection
│   │   ├── controllers/     # authController, universityController
│   │   ├── middleware/      # JWT protect, input validation
│   │   ├── models/          # User, University
│   │   └── routes/          # /api/auth, /api/universities
│   └── seeds/               # University data seeder
├── career-guidance/         # Tests, matcher, universities list
├── community/               # Scholarships, ministry decisions
├── components/              # Shared navbar/footer + mobile menu controller
├── decisions/               # Ministry decision explainers
├── docs/                    # Deployment guide & redesign plan
├── fields-awareness/        # Academic & vocational field pages
├── images/                  # Static assets
├── jordanian-universities/  # Per-university pages
├── psychological-support/   # Wellbeing tools
├── scripts/                 # Build utilities (navbar inliner)
└── user/                    # Dashboard & profile pages
```

## API Overview

| Method | Route                      | Description                        |
| ------ | -------------------------- | ---------------------------------- |
| POST   | `/api/auth/register`       | Create account (rate-limited)      |
| POST   | `/api/auth/login`          | Email/password login               |
| POST   | `/api/auth/google`         | Google ID-token sign-in            |
| GET    | `/api/auth/logout`         | Clear auth cookie                  |
| GET    | `/api/auth/me`             | Current user (protected)           |
| PUT    | `/api/auth/updateprofile`  | Update name/profile                |
| PUT    | `/api/auth/avatar`         | Update base64 avatar               |
| POST   | `/api/auth/test-result`    | Save a test result                 |
| GET    | `/api/auth/test-results`   | Get saved test results             |
| POST   | `/api/auth/save-university`| Bookmark a university/major        |
| GET    | `/api/universities`        | Browse/search universities         |
| GET    | `/api/config`              | Public runtime config (client IDs) |
| GET    | `/api/health`              | Health check                       |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)

### Frontend

Any static server from the repo root works:

```bash
npx serve .            # or: python -m http.server 8080
```

The frontend calls the API via relative `/api/*`. `config.js` sets `window.SITE_API_URL = '/api'`.

For local fullstack development you can also just run the backend — it serves the whole site in development mode.

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in real values
npm run seed           # optional: load Jordanian university data
npm run dev            # http://localhost:5000
```

Create `backend/.env` (see `.env.example`):

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learnmap
JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRES_IN=30d
JWT_COOKIE_EXPIRE=7
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
FRONTEND_URL=http://localhost:5000
# Behind a reverse proxy (Render/Railway/nginx):
TRUST_PROXY=true
SERVE_STATIC=false
```

> **Never commit real secrets.** `.env`, `backend/.env`, and `auth/client_secret_*.json` are gitignored. If a secret was ever exposed, rotate it immediately (Google Cloud Console → Credentials).

## Deployment

See [docs/NETLIFY_DEPLOYMENT.md](docs/NETLIFY_DEPLOYMENT.md) for the full guide.

- **Netlify (frontend)** — `netlify.toml` proxies `/api/*` to the backend (`_redirects` mirrors this for drag-and-drop deploys).
- **Render/Railway (backend)** — set the env vars above with `NODE_ENV=production`, `TRUST_PROXY=true`; static serving is disabled in production by default.
- **Docker** — `Dockerfile` serves the static site via nginx (secrets excluded via `.dockerignore`) and proxies `/api` to the hosted backend; `nginx.conf` is also usable on a plain nginx host.

## Security Notes

- All traffic is rate-limited; auth endpoints have stricter buckets.
- Passwords are bcrypt-hashed; sessions use httpOnly, sameSite cookies.
- Input validation on all mutating routes; NoSQL-injection sanitization enabled.
- The dev-only SPA fallback refuses dotfiles, path traversal, and anything under `backend/`.

## License

All rights reserved © 2026 LearnMap. Contact the maintainers before redistribution.
