# 🔗 Backend Link Configuration

## 🎯 Purpose

This document explains how to configure the connection between your frontend dashboard and the backend Google Sheets API service.

## 🛠️ Configuration Methods

### 1. Environment Variables (Recommended)

The frontend uses Vite's environment variable system with the `VITE_` prefix:

#### Files:
- `.env` - Local development
- `.env.production` - Production builds
- `.env.example` - Documentation of available variables

#### Variable:
```env
VITE_BACKEND_URL=http://localhost:3000
```

### 2. Automatic Detection Logic

The frontend automatically detects the appropriate backend URL based on the environment:

```typescript
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 
                    (typeof window !== 'undefined' && window.location.hostname.includes('railway.app') 
                      ? 'http://google-sheets-rest-api.railway.internal:3000'
                      : 'https://google-sheets-rest-api-production.up.railway.app');
```

This logic checks:
1. Environment variable `VITE_BACKEND_URL`
2. If running in Railway, use internal service URL
3. Default to production external URL

## 🚀 Deployment Scenarios

### Scenario 1: Local Development
```env
# .env
VITE_BACKEND_URL=http://localhost:3000
```

### Scenario 2: Railway with Internal Services
In Railway Dashboard → Variables:
```
VITE_BACKEND_URL=http://google-sheets-rest-api.railway.internal:3000
```

### Scenario 3: External Production Deployment
In Railway Dashboard → Variables:
```
VITE_BACKEND_URL=https://your-backend-url.railway.app
```

## 📋 Configuration Checklist

### Local Development ✅
- [ ] `.env` file created with `VITE_BACKEND_URL=http://localhost:3000`
- [ ] Backend running on port 3000
- [ ] API accessible at `http://localhost:3000/api/v1/sheets`

### Railway Internal Services ✅
- [ ] Both frontend and backend in same Railway project
- [ ] Backend service named `google-sheets-rest-api`
- [ ] Railway variable: `VITE_BACKEND_URL=http://google-sheets-rest-api.railway.internal:3000`

### External Deployment ✅
- [ ] Backend deployed and accessible
- [ ] Railway variable: `VITE_BACKEND_URL=https://your-backend-url.railway.app`

## 🔧 Troubleshooting

### Issue 1: API Connection Failed
**Check**:
- Environment variable is set correctly
- Backend service is running
- Network connectivity between services

### Issue 2: CORS Errors
**Check**:
- Backend `CORS_ORIGIN` variable includes your frontend URL
- For internal services, CORS might still be needed for browser security

### Issue 3: 404 Errors
**Check**:
- Backend endpoints are correct
- API base URL is properly configured
- Service names match expected format

## 🎯 Success Verification

When configured correctly, you should see:
- ✅ Dashboard loading without API connection errors
- ✅ Spreadsheet metadata displaying
- ✅ Sheet data accessible (6,764+ sales records)
- ✅ No console errors related to API calls

## 📞 Support

If you encounter connection issues:
1. Check browser console for specific error messages
2. Verify environment variables are set correctly
3. Ensure backend service is running and accessible
4. Confirm API endpoints are working with curl/postman

Your frontend is now properly configured to connect to your backend service!