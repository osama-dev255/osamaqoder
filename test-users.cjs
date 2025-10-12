const axios = require('axios');

async function test() {
  try {
    // Use the production backend URL
    const response = await axios.get('https://google-sheets-rest-api-production.up.railway.app/api/v1/sheets/Sheet1');
    console.log('Sheet1 data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();