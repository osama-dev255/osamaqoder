import fs from 'fs';
import path from 'path';

// Simple TOML validator
function validateTOML(tomlString) {
  // Basic checks for common TOML syntax
  const lines = tomlString.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and comments
    if (!line || line.startsWith('#')) continue;
    
    // Check for section headers
    if (line.startsWith('[') && line.endsWith(']')) {
      // Valid section header
      continue;
    }
    
    // Check for key-value pairs
    if (line.includes('=')) {
      const [key, value] = line.split('=');
      if (!key || !value) {
        return { valid: false, error: `Invalid key-value pair on line ${i + 1}: ${line}` };
      }
      continue;
    }
    
    // Check for array of tables
    if (line.startsWith('[[') && line.endsWith(']]')) {
      // Valid array of tables
      continue;
    }
    
    // If we get here, it might be an invalid line
    if (line && !line.startsWith('[') && !line.includes('=')) {
      return { valid: false, error: `Unexpected line format on line ${i + 1}: ${line}` };
    }
  }
  
  return { valid: true };
}

// Validate netlify.toml
const netlifyTomlPath = path.join(process.cwd(), 'netlify.toml');

if (fs.existsSync(netlifyTomlPath)) {
  console.log('🔍 Validating netlify.toml...');
  
  const tomlContent = fs.readFileSync(netlifyTomlPath, 'utf8');
  console.log('📄 File content:');
  console.log(tomlContent);
  
  const validation = validateTOML(tomlContent);
  
  if (validation.valid) {
    console.log('✅ netlify.toml syntax is valid');
  } else {
    console.log('❌ netlify.toml syntax error:', validation.error);
    process.exit(1);
  }
} else {
  console.log('❌ netlify.toml file not found');
  process.exit(1);
}

console.log('✅ TOML validation complete');