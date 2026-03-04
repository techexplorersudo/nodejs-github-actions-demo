# Node.js GitHub Actions Demo - Beginner's Guide

Welcome! This guide will help you understand GitHub Actions workflows using a simple Node.js project. Let's break down everything step by step.

---

## 📋 Table of Contents
1. [What is GitHub Actions?](#what-is-github-actions)
2. [Project Structure](#project-structure)
3. [Understanding the Files](#understanding-the-files)
4. [Dependencies Explained](#dependencies-explained)
5. [Why package-lock.json Matters](#why-package-lockjson-matters)
6. [The GitHub Actions Workflow](#the-github-actions-workflow)
7. [Checking Workflow Results](#checking-workflow-results)
8. [Running Locally](#running-locally)
9. [Validation Commands](#validation-commands)

---

## What is GitHub Actions?

**GitHub Actions** is an automation tool that runs your code tests and tasks automatically whenever you push code or create a pull request. Think of it as a robot that checks your work every time you upload code to GitHub!

### Why Use It?
- ✅ Automatically test your code
- ✅ Catch bugs before they reach production
- ✅ Ensure code quality and consistency
- ✅ Run tasks without manual intervention

---

## Project Structure

```
nodejs-github-actions-demo/
│
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions workflow file
│
├── index.js                       # Main application code
├── index.test.js                  # Test cases
├── package.json                   # Project metadata & dependencies
├── package-lock.json              # Locked dependency versions
└── node_modules/                  # Installed packages (auto-generated)
```

---

## Understanding the Files

### 🔹 **index.js** - The Main Application

This file contains your application logic:

```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint - returns server status
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running!' });
});

// Home endpoint - returns welcome message
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Node.js GitHub Actions Demo!' });
});

// Utility function - greets a person by name
function greet(name) {
  return `Hello, ${name}!`;
}

// Start server (only when not testing)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = { app, greet };
```

**What does it do?**
- Creates an Express.js web server
- Defines two API endpoints (`/` and `/health`)
- Has a `greet()` function that combines a greeting with a name
- Exports the app and function for testing

---

### 🔹 **index.test.js** - The Test File

This file contains all the tests that verify your code works correctly:

```javascript
const { app, greet } = require('./index');
const request = require('supertest');

describe('Greet Function', () => {
  test('should return greeting message', () => {
    expect(greet('World')).toBe('Hello, World!');
  });

  test('should greet with different names', () => {
    expect(greet('Alice')).toBe('Hello, Alice!');
    expect(greet('Bob')).toBe('Hello, Bob!');
  });
});

describe('Express App', () => {
  test('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Welcome to Node.js GitHub Actions Demo!');
  });

  test('GET /health should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });
});
```

**What does it do?**
- Tests the `greet()` function with different names
- Tests the Express API endpoints to ensure they return correct responses
- Verifies HTTP status codes and response data
- Uses **Jest** (testing framework) and **Supertest** (HTTP testing library)

**Test Categories:**
- **Greet Function Tests** - Check if the greeting function works correctly
- **Express App Tests** - Check if the API endpoints work properly

---

## Dependencies Explained

### 📦 **package.json** - Project Configuration

```json
{
  "name": "nodejs-github-actions-demo",
  "version": "1.0.0",
  "description": "A simple Node.js project to understand GitHub Actions workflows",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

**What's in package.json?**

| Section | Purpose | Example |
|---------|---------|---------|
| **name** | Project name | `nodejs-github-actions-demo` |
| **version** | Current version | `1.0.0` |
| **main** | Entry point file | `index.js` |
| **scripts** | Commands to run tasks | `npm start`, `npm test` |
| **dependencies** | Packages needed to run the app | `express` (web server) |
| **devDependencies** | Packages only needed for development/testing | `jest`, `supertest` |

### 🔧 **Dependencies Breakdown:**

#### **Production Dependencies** (needed to run the app)
- **express** (`^4.18.2`) - A web server framework
  - Used to create HTTP endpoints
  - Allows your app to respond to web requests

#### **Development Dependencies** (only needed for testing)
- **jest** (`^29.7.0`) - Testing framework
  - Runs your test files
  - Checks if your code behaves correctly

- **supertest** (`^6.3.3`) - HTTP testing library
  - Simulates HTTP requests to your Express app
  - Allows testing API endpoints

**Version Symbols Explained:**
- `^4.18.2` means: Use version 4.18.2 or any compatible newer version (minor/patch updates allowed)

---

## Why package-lock.json Matters

### 🔒 **What is package-lock.json?**

When you run `npm install`, npm downloads packages and their dependencies. The **package-lock.json** file **locks** the exact versions that were installed.

### **Example:**
```
package.json says: "express": "^4.18.2"
This means: version 4.18.2 or newer compatible versions

package-lock.json says: "express": "4.18.2"
This means: EXACTLY version 4.18.2
```

### **Why It's Critical for GitHub Actions:**

1. **Consistency Across Machines**
   - Local computer installs version 4.18.5
   - GitHub Actions server installs version 4.18.8
   - This causes tests to pass locally but fail in GitHub Actions!

2. **Reproducibility**
   - GitHub Actions uses `npm ci` (install from lock file)
   - If package-lock.json isn't in git, GitHub gets different versions
   - Your code may pass locally but fail in CI/CD

3. **Security**
   - Prevents unexpected package updates with potential vulnerabilities
   - Ensures everyone uses tested, approved versions

### **How GitHub Actions Uses It:**
```yaml
# In .github/workflows/ci.yml
- name: Install dependencies
  run: npm ci  # Uses package-lock.json for exact versions
```

### **⚠️ Important:**
- ✅ **Always** commit `package-lock.json` to Git
- ✅ **Never** ignore it
- ✅ **Never** delete it manually
- It ensures GitHub Actions uses the exact same versions as your local setup

---

## The GitHub Actions Workflow

### 📁 **Location:** `.github/workflows/ci.yml`

This file defines automatic tasks that run whenever you push code:

```yaml
name: CI Workflow

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [22.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Display test results
        if: always()
        run: echo "Tests completed successfully!"
```

### **Line-by-Line Breakdown:**

| Line | What It Does |
|------|-------------|
| `name: CI Workflow` | Names this workflow |
| `on: push: branches: [ main ]` | Runs when you push to the `main` branch |
| `pull_request: branches: [ main ]` | Also runs when someone creates a pull request to `main` |
| `runs-on: ubuntu-latest` | Runs on a Linux machine (Ubuntu) |
| `node-version: [22.x]` | Tests with Node.js version 22.x |
| `Checkout code` | Downloads your code from GitHub |
| `Set up Node.js` | Installs Node.js with caching |
| `cache: 'npm'` | Saves npm packages for faster runs |
| `npm ci` | Installs dependencies from `package-lock.json` |
| `npm test` | Runs all tests |
| `if: always()` | Runs even if previous steps fail |

---

## Checking Workflow Results

### ✅ **On GitHub Website:**

1. **Go to Your Repository**
   - Open your GitHub repository in a browser

2. **Click the "Actions" Tab**
   ```
   Repository Page → Actions Tab → CI Workflow
   ```

3. **View Workflow Runs**
   - Green checkmark ✅ = Tests passed
   - Red X ❌ = Tests failed
   - Yellow dot 🟡 = Currently running

4. **Click on a Specific Run**
   - See which step failed (if any)
   - View full logs and errors
   - Check console output

### **Example Workflow Success:**
```
✅ Checkout code - Success
✅ Set up Node.js 22.x - Success
✅ Install dependencies - Success (cached)
✅ Run tests - Success (4 tests passed)
✅ Display test results - Success
```

### **Reading Test Output:**
When tests pass, you'll see:
```
PASS  index.test.js
  Greet Function
    ✓ should return greeting message (2 ms)
    ✓ should greet with different names (1 ms)
  Express App
    ✓ GET / should return welcome message (15 ms)
    ✓ GET /health should return health status (3 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

---

## Running Locally

Before pushing to GitHub, test your code locally to catch issues early!

### **Prerequisites:**
- Node.js installed (v22.x or higher)
- npm (comes with Node.js)

### **Step 1: Install Dependencies**
```bash
npm install
```
This reads `package.json` and installs all packages listed in `node_modules/`.

### **Step 2: Run Tests Locally**
```bash
npm test
```
This runs Jest tests defined in `index.test.js`.

Expected output:
```
PASS  index.test.js
  ✓ All tests passed!

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

### **Step 3: Run the Application**
```bash
npm start
```
This starts the Express server on `http://localhost:3000`.

You should see:
```
Server is running on http://localhost:3000
```

### **Step 4: Test the API Locally**
Open a new terminal and run:

```bash
# Test the health endpoint
curl http://localhost:3000/health

# Test the home endpoint
curl http://localhost:3000/
```

Or use a browser and visit:
- http://localhost:3000/health
- http://localhost:3000/

### **Step 5: Watch Tests While Developing (Optional)**
```bash
npm run test:watch
```
This reruns tests automatically whenever you save a file.

### **Step 6: Stop the Server**
Press `Ctrl+C` in the terminal to stop the server.

---

## Validation Commands

Use these commands to verify everything is working:

### **1. Check Node.js Installation**
```bash
node --version
npm --version
```
Expected output:
```
v22.x.x
9.x.x
```

### **2. Verify Project Structure**
```bash
# List all files
ls -la

# Check if important files exist
ls index.js index.test.js package.json package-lock.json
```

### **3. Check Dependencies Are Installed**
```bash
npm list --depth=0
```
Should show all packages listed in package.json.

### **4. Run All Tests**
```bash
npm test
```
Should output:
```
PASS  index.test.js
Tests:       4 passed, 4 total
```

### **5. Start and Test the Server**
```bash
# Terminal 1 - Start server
npm start

# Terminal 2 - Test endpoints
curl -X GET http://localhost:3000/
curl -X GET http://localhost:3000/health
```

### **6. Validate package-lock.json**
```bash
npm ci --dry-run
```
If no errors, your lock file is valid and will work in GitHub Actions.

### **7. Run Jest with Verbose Output**
```bash
npm test -- --verbose
```
Shows detailed output for each test case.

### **8. Check npm Scripts Available**
```bash
npm run
```
Shows all available scripts defined in package.json.

### **9. Audit Dependencies for Security**
```bash
npm audit
```
Checks for known security vulnerabilities in packages.

### **10. Clean Installation** (if tests fail locally)
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

---

## 🎯 Quick Start Checklist

- [ ] Clone the repository
- [ ] Run `npm install` to install dependencies
- [ ] Run `npm test` to verify tests pass locally
- [ ] Run `npm start` to start the server
- [ ] Test the API endpoints using curl or browser
- [ ] Push changes to GitHub (if using git)
- [ ] Check the GitHub Actions tab for workflow results
- [ ] Verify all tests pass in the Actions tab

---

## 🔍 Troubleshooting

### **Problem:** Tests fail locally but work in GitHub Actions (or vice versa)
**Solution:** Ensure you have the same Node.js version. Check `package.json` and GitHub workflow file.

### **Problem:** `npm test` says "command not found"
**Solution:** Run `npm install` first to install jest.

### **Problem:** Server won't start on port 3000
**Solution:** The port might be in use. Try: `PORT=3001 npm start`

### **Problem:** GitHub Actions gets different package versions
**Solution:** Commit `package-lock.json` to git: `git add package-lock.json`

### **Problem:** Tests pass locally but fail in GitHub Actions
**Solution:** Ensure `package-lock.json` is committed. The CI uses `npm ci` to install exact versions.

---

## 📚 Key Concepts Summary

| Concept | Explanation |
|---------|------------|
| **GitHub Actions** | Automation that runs tests/tasks on every push |
| **CI/CD** | Continuous Integration/Continuous Deployment |
| **package.json** | Lists project info and dependencies |
| **package-lock.json** | Locks exact dependency versions |
| **npm install** | Installs packages locally (may update versions) |
| **npm ci** | Installs exact versions from lock file (for CI/CD) |
| **Jest** | Testing framework to run tests |
| **Supertest** | Library to test HTTP endpoints |
| **Express** | Web server framework |
| **Workflow** | Automated tasks defined in `.github/workflows/` |

---

## ✨ Summary

1. **index.js** = Your application code (Express server + greet function)
2. **index.test.js** = Tests that verify the code works
3. **package.json** = Project configuration & dependencies
4. **package-lock.json** = Locked versions for consistency
5. **.github/workflows/ci.yml** = Automation instructions for GitHub
6. **GitHub Actions** = Automatically runs tests when you push code
7. **Local testing** = Run `npm test` and `npm start` before pushing

Now you understand how GitHub Actions works! Happy coding! 🚀

---

**Last Updated:** March 4, 2026
