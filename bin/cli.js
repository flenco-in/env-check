#!/usr/bin/env node

const { checkEnvFiles } = require('../src/index');
const path = require('path');

const cwd = process.cwd();
const result = checkEnvFiles(cwd);

console.log(result.report);
process.exit(result.hasErrors ? 1 : 0);
