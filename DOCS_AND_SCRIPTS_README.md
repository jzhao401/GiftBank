# 📁 GiftBank Project Documentation & Scripts

This directory contains organized documentation and utility scripts for the GiftBank project.

## 📂 Directory Structure

```
/GiftBank/
├── docs/                          # All documentation
│   ├── features/                  # Feature-specific documentation
│   ├── api/                       # API testing & guides
│   ├── IMPLEMENTATION_COMPLETE.md # Overall implementation summary
│   ├── Quick_Start_Guide.txt      # Quick reference card
│   ├── SENTIMENT_FIX_GUIDE.txt    # Sentiment analysis fix guide
│   └── TESTING_CHECKLIST.md       # Comprehensive testing checklist
├── scripts/                       # Utility and testing scripts
│   ├── setup-comments.sh          # Setup and verify comments feature
│   ├── test-sentiment.sh          # Test sentiment analysis
│   ├── test-backend-api.sh        # Test all backend endpoints
│   ├── test-backend-smart.sh      # Smart backend test (auto gift ID)
│   └── test-auth.sh               # Test authentication endpoints
├── giftlink-backend/              # Backend API
├── giftlink-frontend/             # React frontend
├── sentiment/                     # Sentiment analysis service
└── testing/                       # Test suites

```

## 📚 Documentation Guide

### Quick Start
- **`docs/Quick_Start_Guide.txt`** - One-page quick reference
- **`docs/IMPLEMENTATION_COMPLETE.md`** - Complete feature overview

### Comments Feature
- **`docs/features/COMMENTS_FEATURE.md`** - Complete feature documentation
- **`docs/features/COMMENTS_IMPLEMENTATION_SUMMARY.md`** - Implementation details
- **`docs/features/SENTIMENT_STYLING_GUIDE.md`** - Visual styling guide
- **`docs/features/SENTIMENT_IMPROVEMENTS.md`** - Sentiment analysis improvements
- **`docs/features/SENTIMENT_SERVICE_FIX.md`** - Service setup fix
- **`docs/SENTIMENT_FIX_GUIDE.txt`** - Quick sentiment fix reference

### API Documentation
- **`docs/api/BACKEND_API_TESTING.md`** - Backend endpoint testing guide
- **`docs/api/AUTH_API_GUIDE.md`** - Authentication API guide

### Testing
- **`docs/TESTING_CHECKLIST.md`** - Comprehensive manual testing checklist

## 🚀 Scripts Guide

### Setup Scripts

#### Setup Comments Feature
```bash
cd scripts
./setup-comments.sh
```
**What it does:**
- Checks if all services are running
- Offers to add sample comments to database
- Shows setup instructions

### Testing Scripts

#### Test Sentiment Analysis
```bash
cd scripts
./test-sentiment.sh
```
**Tests:**
- Positive sentiment detection
- Negative sentiment detection
- Neutral sentiment detection
- Your specific negative examples

#### Test Backend API (Smart - Recommended)
```bash
cd scripts
./test-backend-smart.sh
```
**Tests:**
- Automatically finds valid gift ID
- Tests all comment operations
- Verifies sentiment analysis
- Shows pass/fail for each test

#### Test Backend API (Manual)
```bash
cd scripts
./test-backend-api.sh
```
**Tests:**
- All backend endpoints
- Requires knowing gift IDs

#### Test Authentication
```bash
cd scripts
./test-auth.sh
```
**Tests:**
- User registration
- Login/logout
- Profile management
- Password updates
- Token validation

## 📖 Reading Order for New Users

### 1. Start Here
```
docs/Quick_Start_Guide.txt
```
Quick overview of the entire system

### 2. Comments Feature
```
docs/features/COMMENTS_FEATURE.md
```
Learn about the comments system

### 3. Test Everything
```
scripts/test-backend-smart.sh
scripts/test-auth.sh
```
Verify everything works

### 4. Deep Dive (Optional)
```
docs/IMPLEMENTATION_COMPLETE.md
docs/features/COMMENTS_IMPLEMENTATION_SUMMARY.md
```
Detailed implementation information

## 🎯 Common Tasks

### I want to test if comments work
```bash
cd scripts
./test-backend-smart.sh
```

### I want to test authentication
```bash
cd scripts
./test-auth.sh
```

### I want to add sample data
```bash
cd scripts
./setup-comments.sh
# Choose "yes" when prompted
```

### I want to test sentiment analysis
```bash
cd scripts
./test-sentiment.sh
```

### I need API documentation
```bash
cat docs/api/BACKEND_API_TESTING.md
cat docs/api/AUTH_API_GUIDE.md
```

### I need to fix sentiment issues
```bash
cat docs/SENTIMENT_FIX_GUIDE.txt
```

## 🔧 Script Permissions

All scripts should be executable. If not, run:
```bash
chmod +x scripts/*.sh
```

## 📝 File Descriptions

### Documentation Files

| File | Purpose |
|------|---------|
| `IMPLEMENTATION_COMPLETE.md` | Overall implementation summary |
| `Quick_Start_Guide.txt` | Quick reference card |
| `SENTIMENT_FIX_GUIDE.txt` | Sentiment analysis fix guide |
| `TESTING_CHECKLIST.md` | Manual testing checklist |
| `features/COMMENTS_FEATURE.md` | Comments feature documentation |
| `features/COMMENTS_IMPLEMENTATION_SUMMARY.md` | Implementation details |
| `features/SENTIMENT_STYLING_GUIDE.md` | Visual styling guide |
| `features/SENTIMENT_IMPROVEMENTS.md` | Sentiment improvements |
| `features/SENTIMENT_SERVICE_FIX.md` | Service setup fix |
| `api/BACKEND_API_TESTING.md` | Backend API testing guide |
| `api/AUTH_API_GUIDE.md` | Authentication API guide |

### Script Files

| Script | Purpose | Usage |
|--------|---------|-------|
| `setup-comments.sh` | Setup comments feature | `./setup-comments.sh` |
| `test-sentiment.sh` | Test sentiment service | `./test-sentiment.sh` |
| `test-backend-api.sh` | Test backend (manual) | `./test-backend-api.sh` |
| `test-backend-smart.sh` | Test backend (auto) | `./test-backend-smart.sh` |
| `test-auth.sh` | Test authentication | `./test-auth.sh` |

## 🎨 Color Coding in Output

Scripts use visual indicators:
- ✅ **Green/Pass** - Test passed
- ❌ **Red/Fail** - Test failed
- ⚠️  **Yellow/Warning** - Check needed
- 📍 **Blue/Info** - Information
- ➕ **Positive** - Positive sentiment
- ➖ **Negative** - Negative sentiment
- ⚪ **Neutral** - Neutral sentiment

## 🐛 Troubleshooting

### Scripts won't run
```bash
chmod +x scripts/*.sh
```

### Can't find gift IDs
Use the smart script:
```bash
cd scripts
./test-backend-smart.sh
```

### Need to test specific endpoint
Check the API guides:
```bash
cat docs/api/BACKEND_API_TESTING.md
cat docs/api/AUTH_API_GUIDE.md
```

### Sentiment not working
Follow the fix guide:
```bash
cat docs/SENTIMENT_FIX_GUIDE.txt
```

## 📊 Test Coverage

### Backend Tests
- ✅ Health check
- ✅ Get all gifts
- ✅ Get single gift
- ✅ Get comments
- ✅ Add comments
- ✅ Sentiment analysis
- ✅ Search functionality

### Authentication Tests
- ✅ User registration
- ✅ Duplicate prevention
- ✅ Login (success/fail)
- ✅ Profile retrieval
- ✅ Profile updates
- ✅ Password changes
- ✅ Token validation

### Frontend Tests
Located in `/testing/frontend/`

### Backend Unit Tests
Located in `/testing/backend/`

## 🔗 Related Files

### Backend
- `giftlink-backend/routes/commentRoutes.js` - Comment API routes
- `giftlink-backend/util/add-sample-comments.js` - Sample data script
- `giftlink-backend/app.js` - Main backend app

### Frontend
- `giftlink-frontend/src/components/DetailsPage/DetailsPage.js` - Comments UI
- `giftlink-frontend/src/components/DetailsPage/DetailsPage.css` - Sentiment styling

### Sentiment Service
- `sentiment/index.js` - Sentiment analysis with pattern matching
- `sentiment/logger.js` - Logging utility

## 💡 Tips

1. **Always use smart scripts** - They auto-detect configuration
2. **Check docs first** - Comprehensive guides available
3. **Run setup script** - Verifies everything is configured
4. **Use test scripts** - Automated testing saves time
5. **Read Quick Start** - Fastest way to understand the system

## 📞 Need Help?

1. Check `docs/Quick_Start_Guide.txt`
2. Review `docs/IMPLEMENTATION_COMPLETE.md`
3. Run `./scripts/setup-comments.sh` for status check
4. Check specific feature docs in `docs/features/`
5. Review API guides in `docs/api/`

## ✅ Next Steps

1. Read `docs/Quick_Start_Guide.txt`
2. Run `./scripts/test-backend-smart.sh`
3. Run `./scripts/test-auth.sh`
4. Review `docs/IMPLEMENTATION_COMPLETE.md`
5. Start developing!

---

**Project:** GiftBank  
**Feature:** Comments with Sentiment Analysis  
**Status:** ✅ Production Ready  
**Last Updated:** December 2024
