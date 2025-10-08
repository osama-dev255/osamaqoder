# Netlify Deployment Troubleshooting Guide

## Common Deployment Issues and Solutions

### 1. Build Failures

**Symptoms**: 
- Deployment fails during the build phase
- Error messages about dependencies or compilation

**Solutions**:
1. **Check Node.js Version**: Ensure Netlify is using a compatible Node.js version (18.x recommended)
   - Set in `netlify.toml`: `NODE_VERSION = "18"`
   - Or set in Netlify dashboard under "Environment Variables"

2. **Dependency Issues**: 
   - Run `npm install` locally and ensure all dependencies are properly listed in `package.json`
   - Check for peer dependency conflicts
   - Use `npm ls` to identify missing or conflicting dependencies

3. **Build Command**: Verify the build command is correct
   - Should be: `npm run build`
   - Check that this command works locally

### 2. React Version Compatibility

**Symptoms**:
- Errors related to React or ReactDOM versions
- Module not found errors for React components

**Solutions**:
1. **Use Stable React Versions**: Downgrade from React 19 to React 18 for better compatibility
   ```json
   "dependencies": {
     "react": "^18.2.0",
     "react-dom": "^18.2.0"
   }
   ```

2. **Update TypeScript Types**: Ensure React types match the React version
   ```json
   "devDependencies": {
     "@types/react": "^18.2.0",
     "@types/react-dom": "^18.2.0"
   }
   ```

### 3. TypeScript Compilation Errors

**Symptoms**:
- Type errors during build
- Cannot find module errors
- ESBuild or TSC compilation failures

**Solutions**:
1. **Update TypeScript Config**: Use more compatible target versions
   ```json
   {
     "target": "ES2020",
     "lib": ["ES2020", "DOM", "DOM.Iterable"]
   }
   ```

2. **Check Path Aliases**: Ensure baseUrl and paths are correctly configured
   ```json
   {
     "baseUrl": ".",
     "paths": {
       "@/*": ["./src/*"]
     }
   }
   ```

### 4. Environment Variable Issues

**Symptoms**:
- Application works locally but fails on Netlify
- API calls fail with CORS or connection errors

**Solutions**:
1. **Set Environment Variables in Netlify**:
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add: `VITE_BACKEND_URL` = `https://google-sheets-rest-api-production.up.railway.app`

2. **Verify Variable Usage**: Ensure variables are accessed correctly in code
   ```javascript
   const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
   ```

### 5. Routing and SPA Issues

**Symptoms**:
- Navigation works locally but fails on Netlify
- Direct URL access results in 404 errors

**Solutions**:
1. **Configure Redirects**: Ensure `netlify.toml` has proper redirect rules
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### 6. Large Bundle Size Warnings

**Symptoms**:
- Warnings about chunks larger than 500kB
- Slow loading times

**Solutions**:
1. **Code Splitting**: Use dynamic imports for large components
   ```javascript
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

2. **Optimize Dependencies**: Remove unused packages
   ```bash
   npm uninstall unused-package
   ```

### 7. TOML Configuration Errors

**Symptoms**:
- Errors parsing `netlify.toml`
- Deployment fails immediately with configuration errors

**Solutions**:
1. **Validate TOML Syntax**: Ensure proper formatting
   - No extra spaces or malformed inline tables
   - Correct indentation (TOML is indentation-sensitive)
   - Proper section headers `[section]` and `[[array-of-tables]]`

2. **Example of Correct netlify.toml**:
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
   ```

## Netlify-Specific Configuration

### netlify.toml Configuration
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
```

### Environment Variables in Netlify
1. Go to Netlify Dashboard
2. Select your site
3. Go to "Site settings" → "Environment variables"
4. Add:
   - Key: `VITE_BACKEND_URL`
   - Value: `https://google-sheets-rest-api-production.up.railway.app`

## Debugging Steps

### 1. Local Testing
```bash
# Clean install and test
rm -rf node_modules package-lock.json
npm install
npm run build
npm run preview
```

### 2. Check Netlify Logs
1. Go to Netlify Dashboard
2. Select your site
3. Go to "Deploys" tab
4. Click on the failed deploy
5. Review the build logs for specific error messages

### 3. Verify Configuration Files
- `netlify.toml` in root directory
- `package.json` with correct scripts and dependencies
- TypeScript configuration files (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`)

## Contact Support

If issues persist:
1. Check [Netlify Documentation](https://docs.netlify.com/)
2. Review [Netlify Community Forums](https://answers.netlify.com/)
3. Contact Netlify Support through the dashboard