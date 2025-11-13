const { detectType, parseEnvFile, checkEnvFiles } = require('../src/index');

console.log('Running env-check tests...\n');

// Test 1: Type detection
console.log('Test 1: Type detection');
const tests = [
  { value: '123', expected: 'number' },
  { value: 'true', expected: 'boolean' },
  { value: 'false', expected: 'boolean' },
  { value: 'https://example.com', expected: 'url' },
  { value: 'test@example.com', expected: 'email' },
  { value: 'hello world', expected: 'string' },
  { value: '192.168.1.1', expected: 'ip' }
];

let passed = 0;
tests.forEach(test => {
  const result = detectType(test.value);
  if (result === test.expected) {
    passed++;
  } else {
    console.log(`  ❌ Failed: "${test.value}" expected ${test.expected}, got ${result}`);
  }
});

if (passed === tests.length) {
  console.log(`✅ Type detection passed (${passed}/${tests.length})\n`);
} else {
  console.log(`⚠️  Type detection: ${passed}/${tests.length} passed\n`);
}

// Test 2: Check fixtures directory
console.log('Test 2: Check fixtures directory');
const fixturesPath = require('path').join(__dirname, 'fixtures');
const result = checkEnvFiles(fixturesPath);

if (result.hasMissing) {
  console.log('✅ Correctly detected missing variables\n');
} else {
  console.log('⚠️  Should have detected missing variables\n');
}

console.log('🎉 Tests complete!');
