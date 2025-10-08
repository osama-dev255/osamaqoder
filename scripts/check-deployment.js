import axios from 'axios';

async function checkDeployment() {
  const deploymentUrl = 'https://osama-dev255.github.io/osamaqoder';
  
  console.log(`Checking deployment at: ${deploymentUrl}`);
  
  try {
    const response = await axios.get(deploymentUrl, {
      timeout: 10000
    });
    
    console.log('✅ Deployment successful!');
    console.log('Status:', response.status);
    console.log('Title:', response.data.match(/<title>(.*?)<\/title>/)?.[1] || 'No title found');
    
    return true;
  } catch (error) {
    console.error('❌ Deployment check failed');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
    }
    
    return false;
  }
}

// Run the deployment check
checkDeployment();