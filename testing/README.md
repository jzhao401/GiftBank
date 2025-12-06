# GiftBank Testing Suite

## Quick Start

### 1. View Test Checklist
```bash
npm run checklist
```

### 2. Run Quick Connectivity Test
```bash
npm install
npm run test:quick
```

### 3. Run Full Integration Tests
```bash
npm test
```

## Test Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Full integration test with pre-flight checks |
| `npm run test:quick` | Quick backend and MongoDB connectivity test |
| `npm run test:profile` | Profile component integration test (skip checks) |
| `npm run checklist` | Display manual test checklist |

## What Gets Tested

### ✅ Backend Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile ⭐ NEW
- PUT /api/auth/update

### ✅ Frontend Profile Component
- Fetch profile from database (not just sessionStorage) ⭐ FIXED
- Update profile with correct payload format ⭐ FIXED
- Handle authentication errors
- Persist data across page refreshes ⭐ FIXED

### ✅ MongoDB Integration
- User registration stores in database
- Profile fetch reads from database
- Profile update modifies database
- Data persistence verification

## Prerequisites

### Required Services
1. **MongoDB** running on `localhost:27017`
   ```bash
   mongod --dbpath /path/to/data
   ```

2. **Backend** running on `http://localhost:3060`
   ```bash
   cd giftlink-backend
   npm start
   ```

3. **Frontend** (optional for manual testing)
   ```bash
   cd giftlink-frontend
   npm start
   ```

### Install Dependencies
```bash
npm install
```

## Test Output

### Success Example
```
✓ MongoDB Connection: PASS
✓ Backend Connection: PASS  
✓ User Registration: PASS
✓ User Login: PASS
✓ Profile Fetch: PASS ⭐ NEW
✓ Profile Update: PASS
✓ MongoDB Verification: PASS

Total Tests: 7
Passed: 7
Failed: 0
```

### Failure Example
```
✗ Backend is NOT running
  Start with: cd giftlink-backend && npm start

Environment Not Ready - Fix Issues Above
```

## Manual Testing

Follow the interactive checklist:
```bash
npm run checklist
```

### Key Tests
1. **Profile Loading** - Visit /profile after login, data loads from DB
2. **Page Refresh** - Refresh /profile, data persists
3. **Profile Update** - Edit name, save, verify it updates
4. **Cross-Tab** - Open new tab, data synced across tabs
5. **Token Expiration** - Clear session, verify redirect to login

## Files

| File | Purpose |
|------|---------|
| `frontend-profile-test.js` | Main integration test suite |
| `check-and-test.js` | Pre-flight checks + test runner |
| `quick-test.js` | Fast connectivity verification |
| `test-checklist.js` | Interactive manual test guide |
| `package.json` | Test configuration |

## Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check if running
ps aux | grep mongod

# Start if needed
mongod --dbpath /path/to/data
```

### "Backend not responding"
```bash
cd ../giftlink-backend
npm start

# Check for port conflicts
lsof -i :3060
```

### "Tests failing"
1. Check backend logs
2. Verify envs file: `MONGO_URL="mongodb://127.0.0.1:27017"`
3. Clear old test users from database
4. Restart backend

### "Profile not loading in browser"
- Open DevTools > Network tab
- Check for GET /api/auth/profile request
- Verify response is 200 with user data
- Check sessionStorage has token and email

## Environment

### Local Testing (Current)
```bash
MONGO_URL="mongodb://127.0.0.1:27017"
REACT_APP_BACKEND_URL="http://localhost:3060"
```

### Kubernetes (Production)
```bash
MONGO_URL="mongodb://mongodb-service:27017"
```

## What Changed

### ✅ Backend
- Added GET /api/auth/profile endpoint
- Returns user data from MongoDB
- Validates JWT token

### ✅ Frontend  
- fetchUserProfile() now calls backend API
- handleSubmit() splits name into firstName/lastName
- Better error handling

### ✅ Testing
- New integration tests
- Environment checks
- Manual test checklist

## Documentation

See parent directory for detailed docs:
- `../FIX_SUMMARY.md` - What was changed
- `../PROFILE_ISSUES.md` - Detailed fixes
- `../ENV_CONFIG.md` - Environment setup
- `../TESTING_GUIDE.md` - Quick reference

## Success Criteria

All of these should pass:
- ✅ Profile loads from database (not sessionStorage)
- ✅ Profile persists across page refreshes
- ✅ Profile update works with firstName/lastName
- ✅ Token validation works
- ✅ Error handling is user-friendly
- ✅ Data syncs across browser tabs

## Next Steps

1. Run `npm run checklist` to see what to test
2. Run `npm test` for automated verification
3. Test manually in browser
4. Check `FIX_SUMMARY.md` for details
