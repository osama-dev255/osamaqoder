const { exec } = require('child_process');
const path = require('path');

console.log('Building frontend...');

// Run TypeScript build
exec('npx tsc -b', (error, stdout, stderr) => {
  if (error) {
    console.error(`TypeScript build error: ${error}`);
    return;
  }
  console.log('TypeScript build completed successfully');
  
  // Run Vite build
  exec('npx vite build', (error, stdout, stderr) => {
    if (error) {
      console.error(`Vite build error: ${error}`);
      return;
    }
    console.log('Vite build completed successfully');
    console.log('Frontend build completed!');
  });
});