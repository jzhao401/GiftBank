# Environment Configuration Guide

## Overview
This project uses `envs` files (not `.env`) for reproducibility. The `.env` in frontend is a symlink to `envs`.

## Configuration Locations

### 1. Backend: `/giftlink-backend/envs`
```bash
# Local Development (Current)
MONGO_URL="mongodb://127.0.0.1:27017"
JWT_SECRET="setasecret"
BREACT_APP_BACKEND_URL="https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai"
```

**Kubernetes Deployment:**
```bash
MONGO_URL="mongodb://mongodb-service:27017"
JWT_SECRET="setasecret"
BREACT_APP_BACKEND_URL="<backend-service-url>"
```

### 2. Frontend: `/giftlink-frontend/src/envs`
```bash
# Local Development
REACT_APP_BACKEND_URL="http://localhost:3060"
```

**Kubernetes Deployment:**
```bash
REACT_APP_BACKEND_URL="<backend-service-url>"
```

### 3. Import Mongo Utility: `/giftlink-backend/util/import-mongo/envs`
```bash
# Already configured for Kubernetes
MONGO_URL="mongodb://mongodb-service:27017"
JWT_SECRET="setasecret"
BREACT_APP_BACKEND_URL="https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai"
```

## Environment Strategy

### Local Testing (Current)
- **MongoDB**: `mongodb://127.0.0.1:27017` 
- **Backend**: `http://localhost:3060`
- **Database**: `giftdb`

### Kubernetes Deployment
- **MongoDB Service**: `mongodb://mongodb-service:27017` (from `deploymongo.yml`)
- **MongoDB NodePort**: `30008` (external access)
- **Backend Service**: Via Ingress/Service
- **Database**: `giftdb`

## Testing Configuration

### For Local Testing
1. Ensure MongoDB is running locally:
   ```bash
   mongod --dbpath /path/to/data
   ```

2. Backend uses: `mongodb://127.0.0.1:27017`
3. Frontend uses: `http://localhost:3060`

### For Kubernetes Testing
1. Deploy MongoDB:
   ```bash
   kubectl apply -f Deploy/deploymongo.yml
   ```

2. Update envs files to use `mongodb://mongodb-service:27017`
3. Deploy application

## Symlink Structure
```
giftlink-frontend/src/.env -> envs  (symlink for React compatibility)
```

React requires `.env` files but we maintain `envs` as source of truth.

## Current Status
✓ Backend envs: Local MongoDB (127.0.0.1:27017)
✓ Frontend envs: Local backend (localhost:3060)
✓ Import-mongo envs: Kubernetes MongoDB (mongodb-service:27017)

## Notes
- **Database name**: `giftdb` (consistent across all environments)
- **JWT_SECRET**: `setasecret` (should be changed in production)
- All `envs` files should be updated together when switching environments
