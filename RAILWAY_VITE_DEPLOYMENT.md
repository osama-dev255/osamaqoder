# 🚀 Railway Vite Deployment Guide

## 🎯 Deploying Your Vite React App to Railway

Railway has native support for Vite applications, which simplifies the deployment process significantly. Follow these steps to deploy your frontend.

## 📋 Prerequisites

1. ✅ Your code is pushed to a GitHub repository
2. ✅ You have a Railway account
3. ✅ Your backend is deployed and accessible

## 🚀 Deployment Steps

### 1. Connect to Railway
1. Visit [railway.app](https://railway.app)
2. Sign in to your account
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository (`osama-dev255/google-sheets-rest-api`)

### 2. Configure Project Settings
Railway will automatically detect this as a Vite project. You need to set:

1. **Root Directory**: `/frontend`
   - This tells Railway where your Vite project is located
   - Found in Railway Dashboard → Your Project → Settings → Root Directory

2. **Build Command**: Railway automatically detects `npm run build`
3. **Output Directory**: Railway automatically uses `dist`

### 3. Environment Variables
No environment variables are required for the frontend. The API configuration is handled in the code.

### 4. Deploy Process
Railway will automatically:
1. Clone your repository
2. Navigate to `/frontend` directory
3. Install dependencies with `npm install`
4. Build the application with `npm run build`
5. Serve the static files automatically

## 🛠️ Railway Service Configuration

### Project Structure in Railway
```
Railway Project
├── google-sheets-rest-api (backend)
│   └── Service Name: google-sheets-rest-api
└── frontend (dashboard)
    └── Root Directory: /frontend
```

### Service Settings
1. **Root Directory**: `/frontend`
2. **Build Command**: `npm run build` (auto-detected)
3. **Start Command**: Automatically handled by Railway
4. **Port**: Automatically managed by Railway

## 🔧 Advanced Configuration

### Using Internal Services
If your frontend and backend are in the same Railway project:

1. Ensure your backend service is named `google-sheets-rest-api`
2. The frontend will automatically use the internal URL:
   `http://google-sheets-rest-api.railway.internal:3000`

### Custom Domain
To use a custom domain:
1. In Railway Dashboard → Your Project → Settings → Custom Domains
2. Add your domain
3. Follow Railway's DNS configuration instructions

## 🧪 Testing Your Deployment

### Before Deploying
Test locally:
```bash
cd frontend
npm run build
npm run preview
```

### After Deploying
1. Visit your Railway project URL
2. Verify the dashboard loads correctly
3. Check that all navigation works
4. Confirm API data is displayed

## 🚨 Common Issues and Solutions

### 1. "Could not detect framework" Error
**Solution**: 
- Ensure "Root Directory" is set to `/frontend`
- Verify package.json is in the frontend directory

### 2. Build Failures
**Solution**:
- Check that `npm run build` works locally
- Ensure all dependencies are in package.json
- Verify TypeScript configuration

### 3. Blank Page or 404 Errors
**Solution**:
- Check Railway logs for build errors
- Verify the "Root Directory" setting
- Ensure index.html is in the public directory

### 4. API Connection Issues
**Solution**:
- Check browser console for CORS errors
- Verify backend is accessible
- Confirm API URLs in `src/config/api.ts`

## 📈 Performance Optimization

Railway automatically:
- ✅ Serves static files with proper caching headers
- ✅ Compresses assets with gzip
- ✅ Handles routing for SPA applications
- ✅ Provides automatic HTTPS

## 🔄 Redeployment

To redeploy after making changes:
1. Push changes to GitHub
2. Railway will automatically rebuild and redeploy
3. Or manually trigger redeploy in Railway Dashboard

## 🎯 Success Indicators

When deployed successfully, you should see:
- ✅ Dashboard loading at your Railway URL
- ✅ All navigation links working
- ✅ API data displaying (your 6,764+ sales records)
- ✅ Responsive design on all devices
- ✅ No console errors in browser

## 📞 Support

If you encounter issues:
1. Check Railway deployment logs
2. Verify all configuration settings
3. Test locally before deploying
4. Ensure backend API is accessible

Your Vite React application is now ready for deployment to Railway using their native support!