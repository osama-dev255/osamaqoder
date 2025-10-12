const axios = require('axios');

async function test() {
  try {
    // Use the production backend URL to get Sales sheet data
    const response = await axios.get('https://google-sheets-rest-api-production.up.railway.app/api/v1/sheets/Sales');
    console.log('Sales sheet data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();