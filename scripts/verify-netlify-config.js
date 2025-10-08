import fs from 'fs';
import path from 'path';

// Check if netlify.toml exists
const netlifyConfigPath = path.join(process.cwd(), 'netlify.toml');

if (fs.existsSync(netlifyConfigPath)) {
  console.log('✅ Netlify configuration file found');
  
  const configContent = fs.readFileSync(netlifyConfigPath, 'utf8');
  console.log('📄 netlify.toml content:');
  console.log(configContent);
  
  // Check for required configuration
  const requiredConfigs = [
    'command = "npm run build"',
    'publish = "dist"',
    'VITE_BACKEND_URL = "https://google-sheets-rest-api-production.up.railway.app"'
  ];
  
  let allConfigsPresent = true;
  for (const config of requiredConfigs) {
    if (configContent.includes(config)) {
      console.log(`✅ Found required config: ${config}`);
    } else {
      console.log(`❌ Missing required config: ${config}`);
      allConfigsPresent = false;
    }
  }
  
  if (allConfigsPresent) {
    console.log('\n✅ All required Netlify configurations are present');
  } else {
    console.log('\n❌ Some required Netlify configurations are missing');
    process.exit(1);
  }
} else {
  console.log('❌ Netlify configuration file not found');
  process.exit(1);
}

// Check if package.json has correct build script
const packageJsonPath = path.join(process.cwd(), 'package.json');

if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log(`✅ Build script found: ${packageJson.scripts.build}`);
  } else {
    console.log('❌ Build script not found in package.json');
    process.exit(1);
  }
} else {
  console.log('❌ package.json not found');
  process.exit(1);
}

console.log('\n✅ Netlify deployment configuration verification complete');