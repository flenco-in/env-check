# @atishpaul/envcheck-cli

<div align="center">
  <a href="https://flenco.in" target="_blank">
    <img src="https://flenco.in/wp-content/uploads/2023/09/cropped-flenco-2023.png" alt="Flenco" width="200"/>
  </a>
  
  <p><strong>Environment Config Verifier</strong></p>
  <p>Compare and validate .env files across environments - catch config drift before it breaks production</p>

  [![npm version](https://img.shields.io/npm/v/@atishpaul/envcheck-cli.svg)](https://www.npmjs.com/package/@atishpaul/envcheck-cli)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  <a href="https://www.buymeacoffee.com/atishpaul" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50">
  </a>
</div>

---

## 🚀 Quick Start

```bash
npx @atishpaul/envcheck-cli
```

That's it! Run it in any directory with `.env` files.

## 📦 Installation

### Use directly with npx (recommended)
```bash
npx @atishpaul/envcheck-cli
```

### Or install globally
```bash
npm install -g @atishpaul/envcheck-cli
envcheck
```

### Or install as dev dependency
```bash
npm install --save-dev @atishpaul/envcheck-cli
```

## 🎯 What It Does

- ✅ Compares `.env`, `.env.example`, `.env.prod`, `.env.staging`, etc.
- ✅ Detects missing or extra variables across environments
- ✅ Validates variable types (number, URL, email, boolean, etc.)
- ✅ Generates a pretty, easy-to-read report
- ✅ Zero dependencies - works standalone
- ✅ Perfect for CI/CD pipelines

## 📖 Example Output

### When Issues Are Found ❌

```
🔍 Environment Config Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Found 3 file(s): .env.example, .env, .env.prod
Total unique keys: 11

❌ Missing Variables:
   DATABASE_URL
      Missing in: .env.prod
   REDIS_URL
      Missing in: .env.prod

⚠️  Type Mismatches:
   PORT
      .env: number
      .env.prod: string

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Summary: 2 missing, 1 type mismatches
```

### When Everything Is OK ✅

```
🔍 Environment Config Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Found 2 file(s): .env, .env.prod
Total unique keys: 5

✅ All environment files are consistent!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Summary: 0 missing, 0 type mismatches
```

## 🔧 Usage

### CLI

```bash
# Check current directory
npx @atishpaul/envcheck-cli

# Add to package.json scripts
{
  "scripts": {
    "check:env": "@atishpaul/envcheck-cli"
  }
}

npm run check:env
```

### CI/CD Integration

**GitHub Actions:**
```yaml
- name: Check environment config
  run: npx @atishpaul/envcheck-cli
```

**GitLab CI:**
```yaml
check-env:
  script:
    - npx @atishpaul/envcheck-cli
```

**Pre-commit Hook:**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "@atishpaul/envcheck-cli"
    }
  }
}
```

### Programmatic Usage

```javascript
const { checkEnvFiles } = require('@atishpaul/envcheck-cli');

const result = checkEnvFiles('./path/to/dir');

if (result.hasErrors) {
  console.log('Issues found:', result.issues);
  console.log(result.report);
}
```

## 📁 Supported Files

Automatically detects and compares:
- `.env`
- `.env.local`
- `.env.development`
- `.env.production`
- `.env.prod`
- `.env.staging`
- `.env.test`
- `.env.example`
- Any file starting with `.env`

## 🔍 Type Detection

Automatically detects:
- **number** - Pure digits (e.g., `3000`)
- **boolean** - `true` or `false`
- **url** - Starts with `http://` or `https://`
- **email** - Valid email format
- **ip** - IP address format
- **string** - Everything else

Type mismatches are reported as warnings, not errors.

## 🎯 Why @atishpaul/envcheck-cli?

**The Problem:**
- Dev teams constantly break staging/prod due to environment config drift
- Missing `.env` variables cause runtime errors
- No easy way to validate consistency across environments
- Manual checking is tedious and error-prone

**The Solution:**
- Automated validation in seconds
- Catches issues before deployment
- Works in CI/CD pipelines
- Zero configuration needed

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

## 📄 License

MIT © [Atish Paul](https://github.com/atishpaul)

## 👨‍💻 Author

**Atish Paul**

- Website: [Flenco.in](https://flenco.in)
- Buy me a coffee: [@atishpaul](https://www.buymeacoffee.com/atishpaul)

---

<div align="center">
  Made with ❤️ by <a href="https://flenco.in">Flenco</a>
</div>
