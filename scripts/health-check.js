import axios from 'axios';

async function checkBackendHealth() {
  const backendUrl = process.env.VITE_BACKEND_URL || 'https://google-sheets-rest-api-production.up.railway.app';
  const healthEndpoint = `${backendUrl}/health`;
  
  console.log(`Checking backend health at: ${healthEndpoint}`);
  
  try {
    const response = await axios.get(healthEndpoint, {
      timeout: 5000
    });
    
    console.log('✅ Backend is healthy');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    return true;
  } catch (error) {
    console.error('❌ Backend health check failed');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    return false;
  }
}

// Run the health check
checkBackendHealth().then((isHealthy) => {
  process.exit(isHealthy ? 0 : 1);
});