# 🚀 Railway Deployment Instructions

## Step-by-Step Deployment Guide

### 1. Access Railway Dashboard
1. Open your browser and go to [railway.app](https://railway.app)
2. Sign in to your Railway account (or create one if you don't have it)
3. Click on "New Project" or "+" button

### 2. Connect to GitHub Repository
1. Select "Deploy from GitHub repo"
2. If prompted, authorize Railway to access your GitHub account
3. Find and select your repository (`osama-dev255/google-sheets-rest-api`)
4. Make sure you're selecting the correct branch (usually `main`)

### 3. Configure Project Settings
Railway should automatically detect that this is a Node.js project. Verify the following settings:

**Build Command**: `npm run build`
**Start Command**: `npm start`
**Root Directory**: `/frontend` (important!)

If Railway doesn't automatically set the root directory to `/frontend`, you'll need to:
1. Click on your project after it's created
2. Go to "Settings" tab
3. Under "Build & Deploy", set the "Root Directory" to `/frontend`

### 4. Environment Variables
For the frontend, no specific environment variables are required. The API endpoint is hardcoded in the source code.

### 5. Deploy Process
1. Railway will automatically start building your project
2. Watch the build logs to ensure everything builds correctly
3. The build process will:
   - Install dependencies with `npm install`
   - Build the frontend with `npm run build`
   - Start the server with `npm start`

### 6. Verify Deployment
Once deployment is complete:
1. Visit your application URL (Railway will provide this)
2. Test the following endpoints:
   - Main page: Should show the dashboard
   - `/health`: Should return a JSON response with health status
   - All navigation links should work
   - API data should display correctly

### 7. Troubleshooting
If you encounter issues:

**Build Failures**:
- Check that all dependencies are in package.json
- Ensure the build command `npm run build` works locally
- Verify Node.js version compatibility

**Runtime Errors**:
- Check Railway logs for detailed error messages
- Ensure server.js is correctly configured
- Verify that all required dependencies are installed

**API Connection Issues**:
- Verify your backend API is accessible at `https://google-sheets-rest-api-production.up.railway.app`
- Check browser console for CORS errors
- Ensure the API URL in `src/config/api.ts` is correct

### 8. Custom Domain (Optional)
If you want to use a custom domain:
1. In your Railway project, go to "Settings"
2. Click "Custom Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions provided by Railway

## 🎉 Success!

Once deployed, your Google Sheets Dashboard will be accessible to anyone with the URL. The dashboard will provide:

- Real-time access to your 6,764+ sales records
- Interactive browsing of all sheets in your spreadsheet
- Detailed metadata information
- Responsive design for all devices

## Need Help?

If you encounter any issues during deployment:
1. Check the Railway build logs for specific error messages
2. Verify all steps in this guide have been followed
3. Ensure your GitHub repository is up to date
4. Confirm your backend API is running and accessible

Your frontend is now ready for production deployment on Railway!