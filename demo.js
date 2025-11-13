#!/usr/bin/env node

/**
 * Demo script to show env-check in action
 * Run: node demo.js
 */

const fs = require('fs');
const path = require('path');
const { checkEnvFiles } = require('./src/index');

// Create demo directory
const demoDir = path.join(__dirname, 'demo-env');
if (!fs.existsSync(demoDir)) {
  fs.mkdirSync(demoDir);
}

console.log('Creating demo .env files...\n');

// Create .env
fs.writeFileSync(path.join(demoDir, '.env'), `# Development Environment
DATABASE_URL=postgres://localhost:5432/dev_db
REDIS_URL=redis://localhost:6379
PORT=3000
DEBUG=true
API_KEY=dev_key_12345
STRIPE_KEY=sk_test_dev123
EMAIL_FROM=dev@example.com
`);

// Create .env.prod with issues
fs.writeFileSync(path.join(demoDir, '.env.prod'), `# Production Environment
DATABASE_URL=postgres://prod-server:5432/prod_db
# Missing REDIS_URL!
PORT="8080"
DEBUG=false
API_KEY=prod_key_xyz789
STRIPE_KEY=sk_live_prod456
EMAIL_FROM=support@example.com
NEW_FEATURE_FLAG=true
`);

// Create .env.example
fs.writeFileSync(path.join(demoDir, '.env.example'), `# Example Environment
DATABASE_URL=postgres://localhost:5432/mydb
REDIS_URL=redis://localhost:6379
PORT=3000
DEBUG=true
API_KEY=your_api_key_here
STRIPE_KEY=sk_test_xxx
EMAIL_FROM=noreply@example.com
`);

console.log('Running env-check...\n');

// Run check
const result = checkEnvFiles(demoDir);
console.log(result.report);

// Cleanup
fs.rmSync(demoDir, { recursive: true, force: true });

console.log('\n✨ Demo complete! The demo-env directory has been cleaned up.');
console.log('\nTry it in your own project:');
console.log('  npx env-check\n');
