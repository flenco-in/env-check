const fs = require('fs');
const path = require('path');

/**
 * Parse .env file into key-value pairs
 */
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const vars = {};

  content.split('\n').forEach(line => {
    line = line.trim();
    
    // Skip empty lines and comments
    if (!line || line.startsWith('#')) return;
    
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      vars[key] = value;
    }
  });

  return vars;
}

/**
 * Detect the type of a value
 */
function detectType(value) {
  if (!value || value === '') return 'empty';
  
  // Remove quotes
  const cleaned = value.replace(/^["']|["']$/g, '');
  
  if (cleaned === 'true' || cleaned === 'false') return 'boolean';
  if (/^\d+$/.test(cleaned)) return 'number';
  if (/^https?:\/\/.+/.test(cleaned)) return 'url';
  if (/^[\w.-]+@[\w.-]+\.\w+$/.test(cleaned)) return 'email';
  if (/^\d+\.\d+\.\d+\.\d+/.test(cleaned)) return 'ip';
  
  return 'string';
}

/**
 * Find all .env* files in directory
 */
function findEnvFiles(dir) {
  const files = fs.readdirSync(dir);
  return files
    .filter(f => f.startsWith('.env'))
    .map(f => path.join(dir, f))
    .sort((a, b) => {
      // Sort .env.example first, then .env, then others
      const aName = path.basename(a);
      const bName = path.basename(b);
      if (aName === '.env.example') return -1;
      if (bName === '.env.example') return 1;
      if (aName === '.env') return -1;
      if (bName === '.env') return 1;
      return aName.localeCompare(bName);
    });
}

/**
 * Main check function
 */
function checkEnvFiles(dir = process.cwd()) {
  const envFiles = findEnvFiles(dir);
  
  if (envFiles.length === 0) {
    return {
      hasErrors: false,
      report: '✅ No .env files found in current directory'
    };
  }

  // Parse all env files
  const parsed = {};
  envFiles.forEach(file => {
    const vars = parseEnvFile(file);
    if (vars) {
      parsed[path.basename(file)] = vars;
    }
  });

  const fileNames = Object.keys(parsed);
  
  if (fileNames.length === 0) {
    return {
      hasErrors: false,
      report: '✅ No valid .env files to check'
    };
  }

  // Collect all unique keys
  const allKeys = new Set();
  fileNames.forEach(fileName => {
    Object.keys(parsed[fileName]).forEach(key => allKeys.add(key));
  });

  // Build report
  let report = '\n🔍 Environment Config Check\n';
  report += '━'.repeat(50) + '\n\n';
  
  report += `Found ${fileNames.length} file(s): ${fileNames.join(', ')}\n`;
  report += `Total unique keys: ${allKeys.size}\n\n`;

  let hasErrors = false;
  let hasMissing = false;
  let hasTypeMismatch = false;

  // Check each key across all files
  const issues = [];
  
  allKeys.forEach(key => {
    const presence = {};
    const types = {};
    
    fileNames.forEach(fileName => {
      const value = parsed[fileName][key];
      presence[fileName] = value !== undefined;
      if (value !== undefined) {
        types[fileName] = detectType(value);
      }
    });

    // Check for missing keys
    const missingIn = fileNames.filter(f => !presence[f]);
    if (missingIn.length > 0 && missingIn.length < fileNames.length) {
      issues.push({
        type: 'missing',
        key,
        files: missingIn
      });
      hasMissing = true;
      hasErrors = true;
    }

    // Check for type mismatches
    const typeValues = Object.values(types);
    const uniqueTypes = [...new Set(typeValues)];
    if (uniqueTypes.length > 1 && !uniqueTypes.includes('empty')) {
      issues.push({
        type: 'type-mismatch',
        key,
        types
      });
      hasTypeMismatch = true;
    }
  });

  // Print issues
  if (hasMissing) {
    report += '❌ Missing Variables:\n';
    issues
      .filter(i => i.type === 'missing')
      .forEach(issue => {
        report += `   ${issue.key}\n`;
        issue.files.forEach(f => {
          report += `      Missing in: ${f}\n`;
        });
      });
    report += '\n';
  }

  if (hasTypeMismatch) {
    report += '⚠️  Type Mismatches:\n';
    issues
      .filter(i => i.type === 'type-mismatch')
      .forEach(issue => {
        report += `   ${issue.key}\n`;
        Object.entries(issue.types).forEach(([file, type]) => {
          report += `      ${file}: ${type}\n`;
        });
      });
    report += '\n';
  }

  if (!hasErrors && !hasTypeMismatch) {
    report += '✅ All environment files are consistent!\n\n';
  }

  // Summary
  report += '━'.repeat(50) + '\n';
  report += `Summary: ${issues.filter(i => i.type === 'missing').length} missing, `;
  report += `${issues.filter(i => i.type === 'type-mismatch').length} type mismatches\n`;

  return {
    hasErrors,
    hasMissing,
    hasTypeMismatch,
    issues,
    report
  };
}

module.exports = {
  checkEnvFiles,
  parseEnvFile,
  detectType,
  findEnvFiles
};
