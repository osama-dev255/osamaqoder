# GitHub Deployment Guide

## Repository Information

Your POS system has been successfully pushed to GitHub:
https://github.com/osama-dev255/osamaqoder

## GitHub Pages Deployment

The repository is configured with a GitHub Actions workflow that will automatically deploy your POS system to GitHub Pages.

### Deployment URL

Once deployed, your application will be available at:
https://osama-dev255.github.io/osamaqoder

### Enabling GitHub Pages

To enable GitHub Pages for your repository:

1. Go to your GitHub repository: https://github.com/osama-dev255/osamaqoder
2. Click on the "Settings" tab
3. In the left sidebar, scroll down and click on "Pages"
4. Under "Build and deployment":
   - Source: Select "GitHub Actions"
5. Click "Save"

### Setting Main as Default Branch

To set "main" as the default branch:

1. Go to your GitHub repository: https://github.com/osama-dev255/osamaqoder
2. Click on "Settings" tab
3. Under "Default branch" section:
   - Click the "Switch to another branch" button
   - Select "main" from the dropdown
   - Click "Update"

### Triggering Deployment

The deployment will automatically trigger when:
- You push changes to the `main` branch
- You manually run the workflow from the Actions tab

### Checking Deployment Status

1. Go to your repository's "Actions" tab
2. Look for the "Deploy to GitHub Pages" workflow
3. Click on the workflow run to see detailed logs

## Manual Deployment Check

You can check if your deployment is successful by running:
```bash
npm run deploy-check
```

This script will check if your application is accessible at:
https://osama-dev255.github.io/osamaqoder

## Configuration Details

### Environment Variables

The deployment uses the following environment variable:
- `VITE_BACKEND_URL`: https://google-sheets-rest-api-production.up.railway.app

This is configured in the GitHub Actions workflow file at `.github/workflows/deploy.yml`.

### Package.json Configuration

The `package.json` file has been updated with:
- `homepage`: "https://osama-dev255.github.io/osamaqoder"
- `deploy-check` script for deployment verification

## Troubleshooting

### Common Issues

1. **Deployment Not Triggering**
   - Ensure GitHub Pages is enabled with "GitHub Actions" as the source
   - Check that the workflow file is in the correct location (`.github/workflows/deploy.yml`)
   - Verify that "main" is set as the default branch

2. **Application Not Loading**
   - Verify the `homepage` field in `package.json` matches your GitHub Pages URL
   - Check the browser console for any errors
   - Ensure all assets are loading correctly (check Network tab)

3. **Backend Connection Issues**
   - Confirm that `VITE_BACKEND_URL` is correctly set in the workflow
   - Check that the backend API is accessible from the deployed frontend

### Checking Build Logs

To check build logs:
1. Go to your repository's "Actions" tab
2. Click on the latest "Deploy to GitHub Pages" workflow run
3. Review the "Build" job logs for any errors

## Post-Deployment

### Monitoring

- GitHub will automatically provide deployment status
- You can monitor your site's uptime using external services
- Check the browser console for any runtime errors

### Updates

To update your deployed application:
1. Make changes to your code
2. Commit and push to the `main` branch
3. The GitHub Actions workflow will automatically deploy the updates

## Support

For deployment issues, you can:
1. Check the GitHub Actions workflow logs
2. Review the GitHub Pages settings
3. Verify the repository configuration
4. Contact GitHub support if needed