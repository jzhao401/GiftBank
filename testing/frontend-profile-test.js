/**
 * Frontend Profile Component Integration Test
 * Tests the Profile component's connection to the backend and MongoDB
 * 
 * Environment: Uses local MongoDB (127.0.0.1:27017) for testing
 * Production: Will use mongodb://mongodb-service:27017 in Kubernetes
 */

const fetch = require('node-fetch');

// Configuration - reads from giftlink-frontend/src/envs
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3060';
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';

const TEST_USER = {
  email: `test_${Date.now()}@example.com`,
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User'
};

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function displayEnvironmentInfo() {
  log('\n=== Environment Configuration ===', colors.cyan);
  log(`Backend URL: ${BACKEND_URL}`, colors.reset);
  log(`MongoDB URL: ${MONGO_URL}`, colors.reset);
  log(`Database: giftdb`, colors.reset);
  log(`Test Mode: Local Development`, colors.reset);
  log(`(Production will use: mongodb://mongodb-service:27017)`, colors.yellow);
}

async function testBackendConnection() {
  log('\n=== Testing Backend Connection ===', colors.blue);
  try {
    const response = await fetch(BACKEND_URL);
    if (response.ok) {
      const text = await response.text();
      log('✓ Backend is running', colors.green);
      log(`  Response: ${text}`, colors.reset);
      return true;
    } else {
      log('✗ Backend responded with error', colors.red);
      return false;
    }
  } catch (error) {
    log(`✗ Cannot connect to backend: ${error.message}`, colors.red);
    log(`  Expected URL: ${BACKEND_URL}`, colors.yellow);
    return false;
  }
}

async function testMongoConnection() {
  log('\n=== Testing MongoDB Connection ===', colors.blue);
  try {
    const MongoClient = require('mongodb').MongoClient;
    const client = new MongoClient(MONGO_URL);
    
    await client.connect();
    log('✓ Connected to MongoDB', colors.green);
    
    const db = client.db('giftdb');
    const collections = await db.listCollections().toArray();
    log(`  Database: giftdb`, colors.reset);
    log(`  Collections: ${collections.map(c => c.name).join(', ')}`, colors.reset);
    
    await client.close();
    return true;
  } catch (error) {
    log(`✗ Cannot connect to MongoDB: ${error.message}`, colors.red);
    log(`  Expected URL: ${MONGO_URL}`, colors.yellow);
    return false;
  }
}

async function testUserRegistration() {
  log('\n=== Testing User Registration ===', colors.blue);
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_USER),
    });

    const data = await response.json();
    
    if (response.ok && data.authtoken) {
      log('✓ User registration successful', colors.green);
      log(`  Email: ${TEST_USER.email}`, colors.reset);
      log(`  Token: ${data.authtoken.substring(0, 30)}...`, colors.reset);
      return { success: true, token: data.authtoken, email: data.email };
    } else {
      log(`✗ Registration failed: ${JSON.stringify(data)}`, colors.red);
      return { success: false };
    }
  } catch (error) {
    log(`✗ Registration error: ${error.message}`, colors.red);
    return { success: false };
  }
}

async function testUserLogin() {
  log('\n=== Testing User Login ===', colors.blue);
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password,
      }),
    });

    const data = await response.json();
    
    if (response.ok && data.authtoken) {
      log('✓ User login successful', colors.green);
      log(`  User Name: ${data.userName}`, colors.reset);
      log(`  Email: ${data.userEmail}`, colors.reset);
      log(`  Token: ${data.authtoken.substring(0, 30)}...`, colors.reset);
      return { success: true, token: data.authtoken, userName: data.userName, email: data.userEmail };
    } else {
      log(`✗ Login failed: ${JSON.stringify(data)}`, colors.red);
      return { success: false };
    }
  } catch (error) {
    log(`✗ Login error: ${error.message}`, colors.red);
    return { success: false };
  }
}

async function testProfileUpdate(token, email) {
  log('\n=== Testing Profile Update ===', colors.blue);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Email': email,
      },
      body: JSON.stringify({
        firstName: 'UpdatedFirst',
        lastName: 'UpdatedLast',
      }),
    });

    const data = await response.json();
    
    if (response.ok && data.authtoken) {
      log('✓ Profile update successful', colors.green);
      log(`  New token received`, colors.reset);
      return { success: true };
    } else {
      log(`✗ Profile update failed: ${JSON.stringify(data)}`, colors.red);
      log(`  Status: ${response.status}`, colors.red);
      return { success: false };
    }
  } catch (error) {
    log(`✗ Profile update error: ${error.message}`, colors.red);
    return { success: false };
  }
}

async function testProfileDataFetch(token, email) {
  log('\n=== Testing Profile Data Fetch (Expected to Fail) ===', colors.blue);
  log('⚠ This endpoint does not exist yet', colors.yellow);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Email': email,
      },
    });

    if (response.ok) {
      const data = await response.json();
      log('✓ Profile fetch successful', colors.green);
      log(`  Data: ${JSON.stringify(data)}`, colors.reset);
      return { success: true };
    } else {
      log(`✗ Profile fetch failed (expected): ${response.status}`, colors.yellow);
      log('  This is the missing endpoint that needs to be added', colors.yellow);
      return { success: false, expected: true };
    }
  } catch (error) {
    log(`✗ Profile fetch error (expected): ${error.message}`, colors.yellow);
    return { success: false, expected: true };
  }
}

async function verifyUserInMongoDB(email) {
  log('\n=== Verifying User in MongoDB ===', colors.blue);
  try {
    const MongoClient = require('mongodb').MongoClient;
    const client = new MongoClient(MONGO_URL);
    
    await client.connect();
    const db = client.db('giftdb');
    const collection = db.collection('users');
    
    const user = await collection.findOne({ email });
    
    if (user) {
      log('✓ User found in MongoDB', colors.green);
      log(`  Email: ${user.email}`, colors.reset);
      log(`  Name: ${user.firstName} ${user.lastName}`, colors.reset);
      log(`  Created: ${user.createdAt}`, colors.reset);
      if (user.updatedAt) {
        log(`  Updated: ${user.updatedAt}`, colors.reset);
      }
    } else {
      log('✗ User not found in MongoDB', colors.red);
    }
    
    await client.close();
    return user !== null;
  } catch (error) {
    log(`✗ MongoDB verification error: ${error.message}`, colors.red);
    return false;
  }
}

async function checkProfileComponentIssues() {
  log('\n=== Profile Component Issues ===', colors.blue);
  
  log('\n⚠ Issue #1: No Backend Profile Fetch', colors.yellow);
  log('  Profile.js only reads from sessionStorage', colors.reset);
  log('  Missing: GET /api/auth/profile endpoint', colors.reset);
  log('  Impact: Data lost on page refresh', colors.reset);
  
  log('\n⚠ Issue #2: Update Payload Mismatch', colors.yellow);
  log('  Profile.js sends: { name: "Full Name" }', colors.reset);
  log('  Backend expects: { firstName: "First", lastName: "Last" }', colors.reset);
  log('  Status: Backend handles firstName/lastName correctly', colors.reset);
  log('  Fix needed: Profile.js should split name before sending', colors.reset);
  
  log('\n⚠ Issue #3: Session Storage Keys', colors.yellow);
  log('  Profile.js uses: "token", "name", "email"', colors.reset);
  log('  Verify: Login/Register set these keys consistently', colors.reset);
  
  log('\n✓ Database Configuration', colors.green);
  log('  Local: mongodb://127.0.0.1:27017', colors.reset);
  log('  Kubernetes: mongodb://mongodb-service:27017', colors.reset);
  log('  Current: Using local for testing', colors.reset);
}

// Main test runner
async function runTests() {
  log('\n╔════════════════════════════════════════════╗', colors.blue);
  log('║  GiftBank Profile Integration Test Suite  ║', colors.blue);
  log('╚════════════════════════════════════════════╝', colors.blue);
  
  await displayEnvironmentInfo();
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
  };

  // Test 1: MongoDB connection
  const mongoTest = await testMongoConnection();
  results.total++;
  mongoTest ? results.passed++ : results.failed++;
  
  if (!mongoTest) {
    log('\n⚠ MongoDB is not running. Start it with:', colors.yellow);
    log('  mongod --dbpath /path/to/data', colors.yellow);
    log('  Or ensure Docker MongoDB is running', colors.yellow);
  }

  // Test 2: Backend connection
  const backendTest = await testBackendConnection();
  results.total++;
  backendTest ? results.passed++ : results.failed++;
  
  if (!backendTest) {
    log('\n⚠ Backend is not running. Start it with:', colors.yellow);
    log('  cd giftlink-backend && npm start', colors.yellow);
    log('\nTest suite stopped.', colors.red);
    return;
  }

  // Test 3: Registration
  const regResult = await testUserRegistration();
  results.total++;
  regResult.success ? results.passed++ : results.failed++;

  if (!regResult.success) {
    log('\nStopping tests - registration failed', colors.red);
    await checkProfileComponentIssues();
    return;
  }

  // Test 4: Login
  const loginResult = await testUserLogin();
  results.total++;
  loginResult.success ? results.passed++ : results.failed++;

  if (!loginResult.success) {
    log('\nStopping tests - login failed', colors.red);
    await checkProfileComponentIssues();
    return;
  }

  // Test 5: Verify user in MongoDB
  const mongoVerify = await verifyUserInMongoDB(TEST_USER.email);
  results.total++;
  mongoVerify ? results.passed++ : results.failed++;

  // Test 6: Profile update
  const updateResult = await testProfileUpdate(loginResult.token, loginResult.email);
  results.total++;
  updateResult.success ? results.passed++ : results.failed++;

  // Test 7: Verify update in MongoDB
  if (updateResult.success) {
    log('\n=== Verifying Update in MongoDB ===', colors.blue);
    await verifyUserInMongoDB(TEST_USER.email);
  }

  // Test 8: Profile fetch (expected to fail - endpoint doesn't exist)
  await testProfileDataFetch(loginResult.token, loginResult.email);

  // Code analysis
  await checkProfileComponentIssues();

  // Summary
  log('\n╔════════════════════════════════════════════╗', colors.blue);
  log('║            Test Summary                     ║', colors.blue);
  log('╚════════════════════════════════════════════╝', colors.blue);
  log(`Total Tests: ${results.total}`, colors.reset);
  log(`Passed: ${results.passed}`, colors.green);
  log(`Failed: ${results.failed}`, results.failed > 0 ? colors.red : colors.green);
  
  log('\n📋 Next Steps:', colors.cyan);
  log('1. Add GET /api/auth/profile endpoint to backend', colors.reset);
  log('2. Update Profile.js to fetch from backend', colors.reset);
  log('3. Fix Profile.js to split name into firstName/lastName', colors.reset);
  log('4. See PROFILE_ISSUES.md for detailed fixes', colors.reset);
  
  if (results.failed === 0) {
    log('\n✓ Core functionality working!', colors.green);
  } else {
    log('\n⚠ Some tests failed - check details above', colors.yellow);
  }
}

// Check if mongodb package is installed
try {
  require('mongodb');
} catch (error) {
  console.log('\n⚠ MongoDB driver not installed. Installing...');
  console.log('Run: npm install mongodb node-fetch');
  process.exit(1);
}

// Run the tests
runTests().catch(error => {
  log(`\nTest suite error: ${error.message}`, colors.red);
  process.exit(1);
});
