// Test script to check data mapping
fetch('https://google-sheets-rest-api-production.up.railway.app/api/v1/sheets/Products')
  .then(response => response.json())
  .then(data => {
    console.log('Full response:', data);
    if (data && data.data && data.data.values) {
      console.log('Headers:', data.data.values[0]);
      console.log('First data row:', data.data.values[1]);
      
      // Show mapping
      const headers = data.data.values[0];
      const firstRow = data.data.values[1];
      
      console.log('\nColumn mapping:');
      headers.forEach((header, index) => {
        console.log(`${index}: ${header} = ${firstRow[index]}`);
      });
    }
  })
  .catch(error => console.error('Error:', error));