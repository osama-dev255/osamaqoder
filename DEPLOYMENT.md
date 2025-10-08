# Deployment Guide

## Netlify Deployment

### Prerequisites
- A Netlify account
- This repository pushed to a Git provider (GitHub, GitLab, or Bitbucket)

### Deployment Steps

1. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your Git provider and select this repository

2. **Configure Build Settings**
   - Set the build command to: `npm run build`
   - Set the publish directory to: `dist`
   - The site will automatically deploy when you push to the main branch

3. **Environment Variables**
   Add the following environment variable in Netlify:
   - Key: `VITE_BACKEND_URL`
   - Value: `https://google-sheets-rest-api-production.up.railway.app`

4. **Domain Settings (Optional)**
   - Go to "Domain settings" in your Netlify site dashboard
   - Add a custom domain if desired
   - Netlify will provide a free subdomain by default

### Manual Deployment

If you prefer to deploy manually:

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Upload the contents of the `dist` directory to your hosting provider
   - Ensure your hosting provider is configured to serve `index.html` for all routes (SPA routing)

## Environment Configuration

The application uses the following environment variable:

- `VITE_BACKEND_URL`: The base URL for the backend API
  - Default: `https://google-sheets-rest-api-production.up.railway.app`

## Troubleshooting

### Common Issues

1. **Blank Page After Deployment**
   - Ensure the `homepage` field in `package.json` is set to `"."`
   - Check that the publish directory is set to `dist`
   - Verify that redirects are configured correctly in `netlify.toml`

2. **API Connection Issues**
   - Confirm that `VITE_BACKEND_URL` is set correctly
   - Check that the backend API is accessible
   - Verify CORS settings on the backend

3. **Build Failures**
   - Ensure Node.js version 16 or higher is used
   - Check that all dependencies are installed correctly
   - Review the build logs for specific error messages

### Testing Deployment

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