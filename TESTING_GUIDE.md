# GiftBank Testing Quick Start

## Test Profile Component

### 1. Setup
```bash
# Terminal 1: Start MongoDB
mongod --dbpath /path/to/data

# Terminal 2: Start Backend
cd giftlink-backend
npm install
npm start

# Terminal 3: Start Frontend (optional for manual testing)
cd giftlink-frontend
npm install
npm start

# Terminal 4: Run Integration Tests
cd testing
npm install
npm run test:profile
```

### 2. What the Test Does
- ✓ Verifies MongoDB connection (local: 127.0.0.1:27017)
- ✓ Verifies backend connection (localhost:3060)
- ✓ Creates test user in database
- ✓ Tests login flow
- ✓ Verifies user stored in MongoDB
- ✓ Tests profile update
- ✓ Attempts profile fetch (will fail - endpoint missing)

### 3. Expected Results
```
✓ MongoDB Connection: PASS
✓ Backend Connection: PASS
✓ User Registration: PASS
✓ User Login: PASS
✓ MongoDB Verification: PASS
✓ Profile Update: PASS
✗ Profile Fetch: FAIL (expected - endpoint doesn't exist)
```

### 4. Known Issues (See PROFILE_ISSUES.md)
1. Profile doesn't fetch from database (only reads sessionStorage)
2. Update payload mismatch (name vs firstName/lastName)
3. Missing GET /api/auth/profile endpoint

### 5. Quick Fixes Needed
```javascript
// 1. Backend: Add to authRoutes.js
router.get("/profile", async (req, res) => { /* see PROFILE_ISSUES.md */ });

// 2. Frontend: Update Profile.js
const fetchUserProfile = async () => { /* fetch from backend */ };
const handleSubmit = async (e) => { /* split name */ };
```

### 6. Environment Files
- Backend: `giftlink-backend/envs`
- Frontend: `giftlink-frontend/src/envs` (symlinked to .env)
- Import: `giftlink-backend/util/import-mongo/envs`

Current: Local MongoDB (127.0.0.1:27017)
Production: Kubernetes MongoDB (mongodb-service:27017)

## Documentation
- `PROFILE_ISSUES.md` - Detailed fixes
- `ENV_CONFIG.md` - Environment setup
- `testing/frontend-profile-test.js` - Integration test
