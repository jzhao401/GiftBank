#!/usr/bin/env node

/**
 * Interactive Test Runner for GiftBank Profile Component
 */

const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function displayHeader() {
  console.clear();
  log('\n╔════════════════════════════════════════════════════════════╗', colors.blue);
  log('║        GiftBank Profile Component - Test Checklist        ║', colors.blue);
  log('╚════════════════════════════════════════════════════════════╝', colors.blue);
}

function displayInstructions() {
  log('\n📋 Manual Test Checklist', colors.cyan);
  log('═══════════════════════════════════════════════════════', colors.cyan);
  
  const tests = [
    {
      step: 1,
      title: 'Environment Setup',
      checks: [
        'MongoDB is running (mongod)',
        'Backend is running on port 3060',
        'Frontend is running on port 3000 (optional)',
      ]
    },
    {
      step: 2,
      title: 'User Registration & Login',
      checks: [
        'Register a new user',
        'Login successfully',
        'Token stored in sessionStorage',
      ]
    },
    {
      step: 3,
      title: 'Profile Loading (NEW - Fixed)',
      checks: [
        'Navigate to /profile',
        'Profile displays name and email from DATABASE',
        'Data is NOT just from sessionStorage',
        'Backend GET /api/auth/profile is called',
      ]
    },
    {
      step: 4,
      title: 'Profile Persistence (NEW - Fixed)',
      checks: [
        'Refresh the profile page',
        'Profile data still loads (from database)',
        'No redirect to login',
        'Name and email display correctly',
      ]
    },
    {
      step: 5,
      title: 'Profile Update (FIXED)',
      checks: [
        'Click "Edit" button',
        'Change name to "Updated Test User"',
        'Click "Save"',
        'Success message appears',
        'Navbar shows updated name',
      ]
    },
    {
      step: 6,
      title: 'Update Persistence (NEW - Fixed)',
      checks: [
        'Refresh the page after update',
        'Updated name still displays',
        'Open new tab, go to /profile',
        'Updated name appears in new tab',
      ]
    },
    {
      step: 7,
      title: 'Error Handling',
      checks: [
        'Clear sessionStorage and visit /profile',
        'Should redirect to /login',
        'Invalid token should show error',
      ]
    }
  ];

  tests.forEach(test => {
    log(`\n${colors.bold}Step ${test.step}: ${test.title}${colors.reset}`, colors.yellow);
    test.checks.forEach((check, idx) => {
      log(`  ${idx + 1}. ⬜ ${check}`, colors.reset);
    });
  });

  log('\n\n💡 Key Improvements:', colors.cyan);
  log('  ✅ Profile now fetches from MongoDB (not just sessionStorage)', colors.green);
  log('  ✅ Data persists across page refreshes', colors.green);
  log('  ✅ Update payload format fixed (firstName/lastName)', colors.green);
  log('  ✅ Better error handling and user feedback', colors.green);

  log('\n\n🔍 What to Check in Browser DevTools:', colors.cyan);
  log('  • Network tab: GET /api/auth/profile should succeed', colors.reset);
  log('  • Network tab: PUT /api/auth/update payload format', colors.reset);
  log('  • Console: No errors', colors.reset);
  log('  • Application > Storage > Session Storage: token, email, name', colors.reset);
}

function displayAutomatedTestInfo() {
  log('\n\n🤖 Automated Integration Tests', colors.cyan);
  log('═══════════════════════════════════════════════════════', colors.cyan);
  log('\nRun automated tests with:', colors.yellow);
  log('  cd testing', colors.reset);
  log('  npm install', colors.reset);
  log('  npm test', colors.reset);
  
  log('\nTests will verify:', colors.yellow);
  log('  ✓ MongoDB connection', colors.reset);
  log('  ✓ Backend connection', colors.reset);
  log('  ✓ User registration', colors.reset);
  log('  ✓ User login', colors.reset);
  log('  ✓ Profile fetch from database (NEW)', colors.reset);
  log('  ✓ Profile update', colors.reset);
  log('  ✓ Data persistence in MongoDB', colors.reset);
}

function displayComparison() {
  log('\n\n📊 Before vs After Fixes', colors.cyan);
  log('═══════════════════════════════════════════════════════', colors.cyan);
  
  log('\n❌ BEFORE:', colors.red);
  log('  • Profile only reads sessionStorage', colors.reset);
  log('  • Data lost on page refresh', colors.reset);
  log('  • No database fetch', colors.reset);
  log('  • Update payload mismatch', colors.reset);
  
  log('\n✅ AFTER:', colors.green);
  log('  • Profile fetches from MongoDB via API', colors.reset);
  log('  • Data persists across refreshes', colors.reset);
  log('  • New GET /api/auth/profile endpoint', colors.reset);
  log('  • Correct firstName/lastName payload', colors.reset);
}

async function main() {
  displayHeader();
  displayInstructions();
  displayAutomatedTestInfo();
  displayComparison();
  
  log('\n\n' + '═'.repeat(60), colors.cyan);
  log('\nReady to test? Press Enter to continue or Ctrl+C to exit...', colors.yellow);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('', () => {
    rl.close();
    log('\n✅ Happy Testing!', colors.green);
    log('📚 See FIX_SUMMARY.md for detailed changes', colors.cyan);
    log('📚 See TESTING_GUIDE.md for quick reference\n', colors.cyan);
  });
}

main();
