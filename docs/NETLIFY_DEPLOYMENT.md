# LearnMap - Netlify Deployment Guide

## Frontend Deployment (Netlify)

### Option 1: Deploy via Netlify UI
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Set build settings:
   - Build command: (leave empty)
   - Publish directory: `.`
6. Click "Deploy site"

### Option 2: Deploy via CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify site
netlify init

# Deploy
netlify deploy --prod
```

## Backend Deployment

The backend needs to be deployed separately. Recommended platforms:

### Render (Recommended - Free Tier)
1. Go to [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the following:
   - Name: `learnmap-api`
   - Runtime: Node
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Add environment variables:
   - `NODE_ENV`: production
   - `MONGODB_URI`: your MongoDB Atlas connection string
   - `JWT_SECRET`: your secure JWT secret
   - `FRONTEND_URL`: your Netlify URL (e.g., `https://your-site.netlify.app`)
   - `SERVE_STATIC`: false
6. Deploy

### Railway
1. Go to [Railway](https://railway.app)
2. Create a new project
3. Add your GitHub repository
4. Configure the service:
   - Name: `learnmap-api`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Add environment variables (same as Render)
6. Deploy

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.xxxxx.mongodb.net/learnmap
JWT_SECRET=your-secure-jwt-secret-here
FRONTEND_URL=https://your-site.netlify.app
SERVE_STATIC=false
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-api-url.onrender.com/api/auth/google/callback
```

## API Configuration

After deploying the backend, update the API URL in:

1. `netlify.toml` - Update the redirect URL:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-api-url.onrender.com/api/:splat"
  status = 200
  force = true
```

2. `_redirects` - Update the API proxy:
```
/api/*  https://your-api-url.onrender.com/api/:splat  200
```

## MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Add it to your backend environment variables

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add your Netlify URL to authorized origins
4. Add your API URL to authorized redirect URIs
5. Update environment variables with the credentials

## Testing

1. Deploy backend first
2. Test API: `https://your-api-url.onrender.com/api/health`
3. Deploy frontend
4. Test the site

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` is set correctly in backend
- Check that the URL matches exactly (including https://)

### API Not Found
- Verify the API URL in `netlify.toml` and `_redirects`
- Check that the backend is running and healthy

### Authentication Issues
- Ensure JWT_SECRET is set and secure
- Check that cookies are working (same-site settings)

## Performance Tips

1. Enable Netlify's CDN
2. Use Netlify's image optimization
3. Enable Brotli compression in Netlify
4. Set up Netlify's edge functions for A/B testing
