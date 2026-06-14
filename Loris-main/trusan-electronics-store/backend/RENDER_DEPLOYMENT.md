# Render Deployment Guide for Loris E-9 Backend

## Prerequisites
- GitHub account with the repository connected to Render
- Environment variables configured in Render dashboard

## Step 1: Create a New Web Service on Render

1. Go to https://render.com/
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository (avni699/Loris)

## Step 2: Configure Service Settings

### Basic Information
- **Name**: `loris-e9-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users (e.g., `Oregon`)
- **Plan**: Free (or paid for production)

### Build & Deploy
- **Root Directory**: `Loris-main/trusan-electronics-store/backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Branch**: `main`
- **Auto-deploy**: Enabled

## Step 3: Set Environment Variables

In the Render dashboard, add these environment variables:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your_secure_jwt_secret_here
STORE_NAME=Loris E-9
STORE_EMAIL=lawrenceomoit66y@gmail.com
SUPPORT_WHATSAPP=0790206354
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
```

**Important**: Replace `https://your-vercel-frontend-url.vercel.app` with your actual Vercel frontend URL.

### Optional: Email Configuration
If you want email verification to work:
```
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@trusan-electronics.com
```

## Step 4: Deploy

1. Click "Deploy" button in Render dashboard
2. Wait for build to complete
3. Once deployed, you'll get a URL like: `https://loris-e9-backend.onrender.com`
4. Test the backend: `https://loris-e9-backend.onrender.com/`

## Troubleshooting

### Build Fails
- Check "Logs" tab in Render dashboard
- Ensure all required files are in the correct paths
- Verify `package.json` has all dependencies

### Application Crashes After Deploy
- Check environment variables are set correctly
- Review application logs in Render dashboard
- Ensure `PORT` environment variable is set to 10000 or higher

### CORS Errors
- Update `FRONTEND_URL` to match your Vercel deployment URL
- Ensure the frontend URL ends with `.vercel.app`

### Data Persistence
- Note: File-based storage (JSON files) will NOT persist between Render restarts
- For production, consider migrating to a database like MongoDB

## Next Steps

1. Update your frontend to use the Render backend URL
2. Set `VITE_API_BASE_URL=https://loris-e9-backend.onrender.com` in Vercel
3. Test all features (authentication, orders, etc.)
4. Monitor logs and error rates
