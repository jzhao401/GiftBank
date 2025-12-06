/**
 * Pre-flight checks before running tests
 */

const fetch = require('node-fetch');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const BACKEND_URL = 'http://localhost:3060';
const MONGO_URL = 'mongodb://127.0.0.1:27017';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function checkBackend() {
  log('\n=== Checking Backend ===', colors.blue);
  try {
    const response = await fetch(BACKEND_URL, { timeout: 2000 });
    if (response.ok) {
      log('✓ Backend is running on port 3060', colors.green);
      return true;
    }
  } catch (error) {
    log('✗ Backend is NOT running', colors.red);
    log('  Start with: cd giftlink-backend && npm start', colors.yellow);
    return false;
  }
}

async function checkMongoDB() {
  log('\n=== Checking MongoDB ===', colors.blue);
  try {
    const MongoClient = require('mongodb').MongoClient;
    const client = new MongoClient(MONGO_URL, { 
      serverSelectionTimeoutMS: 2000 
    });
    await client.connect();
    await client.close();
    log('✓ MongoDB is running on localhost:27017', colors.green);
    return true;
  } catch (error) {
    log('✗ MongoDB is NOT running', colors.red);
    log('  Start with: mongod --dbpath /path/to/data', colors.yellow);
    return false;
  }
}

async function checkDependencies() {
  log('\n=== Checking Dependencies ===', colors.blue);
  try {
    require('mongodb');
    require('node-fetch');
    log('✓ All dependencies installed', colors.green);
    return true;
  } catch (error) {
    log('✗ Missing dependencies', colors.red);
    log('  Run: npm install', colors.yellow);
    return false;
  }
}

async function main() {
  log('\n╔════════════════════════════════════════════╗', colors.blue);
  log('║     GiftBank Test Environment Check        ║', colors.blue);
  log('╚════════════════════════════════════════════╝', colors.blue);

  const depsOk = await checkDependencies();
  if (!depsOk) {
    log('\nPlease install dependencies first.', colors.red);
    process.exit(1);
  }

  const mongoOk = await checkMongoDB();
  const backendOk = await checkBackend();

  if (!mongoOk || !backendOk) {
    log('\n╔════════════════════════════════════════════╗', colors.red);
    log('║  Environment Not Ready - Fix Issues Above  ║', colors.red);
    log('╚════════════════════════════════════════════╝', colors.red);
    process.exit(1);
  }

  log('\n╔════════════════════════════════════════════╗', colors.green);
  log('║      Environment Ready - Starting Tests    ║', colors.green);
  log('╚════════════════════════════════════════════╝', colors.green);

  // Run the actual tests
  require('./frontend-profile-test.js');
}

main().catch(error => {
  log(`\nCheck failed: ${error.message}`, colors.red);
  process.exit(1);
});
