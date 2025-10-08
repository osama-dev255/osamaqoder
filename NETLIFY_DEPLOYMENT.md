# Netlify Deployment Guide

## Prerequisites

1. A Netlify account (sign up at https://netlify.com if you don't have one)
2. This repository pushed to a Git provider (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy with Git (Recommended)

1. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider and select this repository

2. **Configure Build Settings**
   - Set the build command to: `npm run build`
   - Set the publish directory to: `dist`
   - The site will automatically deploy when you push to the main branch

3. **Environment Variables**
   The `VITE_BACKEND_URL` environment variable is already configured in `netlify.toml`:
   - Key: `VITE_BACKEND_URL`
   - Value: `https://google-sheets-rest-api-production.up.railway.app`

### Option 2: Deploy Manually

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Deploy manually"
   - Drag and drop the contents of the `dist` directory to the deployment area

## Netlify Configuration

This project includes a `netlify.toml` file with the following configuration:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  environment = { NODE_VERSION = "18" }

[build.environment]
  VITE_BACKEND_URL = "https://google-sheets-rest-api-production.up.railway.app"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "npm run dev"
  port = 8888
  targetPort = 5173
```

This configuration ensures:
- Correct build command and publish directory
- Node.js version 18
- Proper environment variable for backend URL
- SPA routing with redirect rules
- Local development settings

## Environment Variables

The application uses the following environment variable:

- `VITE_BACKEND_URL`: The base URL for the backend API
  - Value: `https://google-sheets-rest-api-production.up.railway.app`

This is automatically configured in Netlify through the `netlify.toml` file.

## Custom Domain (Optional)

To set up a custom domain:

1. Go to your Netlify site dashboard
2. Click on "Domain settings"
3. Click "Add custom domain"
4. Follow the instructions to verify and configure your domain

## Troubleshooting

### Common Issues

1. **Blank Page After Deployment**
   - Ensure the `homepage` field in `package.json` is set to `"."`
   - Check that the publish directory is set to `dist`
   - Verify that redirects are configured correctly in `netlify.toml`

2. **API Connection Issues**
   - Confirm that `VITE_BACKEND_URL` is set correctly in Netlify
   - Check that the backend API is accessible
   - Verify CORS settings on the backend

3. **Build Failures**
   - Ensure Node.js version 18 is used (configured in `netlify.toml`)
   - Check that all dependencies are installed correctly
   - Review the build logs for specific error messages

### Checking Build Logs

To check build logs:
1. Go to your Netlify site dashboard
2. Click on "Deploys" tab
3. Click on the latest deploy
4. Review the build logs for any errors

## Testing Deployment

After deployment, verify that:

1. The site loads correctly
2. All navigation works (including direct URLs to pages)
3. API calls are successful
4. Authentication works as expected
5. All UI components render properly

## Post-Deployment

### Monitoring
- Set up monitoring for your Netlify site
- Monitor backend API health using the health check endpoint
- Set up error tracking if needed

### Updates
- Push to the main branch to automatically trigger a new deployment
- Netlify will automatically build and deploy the new version
- Rollback to previous deployments is available in the Netlify dashboard

## Support

For deployment issues, contact the development team or refer to:
- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)