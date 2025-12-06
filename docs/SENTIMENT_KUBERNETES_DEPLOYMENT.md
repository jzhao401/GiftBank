# Sentiment Service - Kubernetes Deployment Guide

This guide covers deploying the sentiment analysis service to Kubernetes.

## 📁 Files Created

1. **`Deploy/sentiment-deployment.yml`** - Kubernetes deployment configuration
2. **`sentiment/Dockerfile`** - Docker image configuration
3. **`sentiment/.dockerignore`** - Docker ignore rules

## 🏗️ Architecture

### Components

**Deployment:**
- 2 replicas for high availability
- Runs on port 3000
- Resource limits: 256Mi memory, 500m CPU
- Health checks configured

**Services:**
- **ClusterIP Service** - Internal communication (default)
  - Name: `sentiment-service`
  - Port: 3000
  - Used by backend to access sentiment analysis

- **NodePort Service** - External access (optional, for testing)
  - Name: `sentiment-service-nodeport`
  - Port: 3000
  - NodePort: 30009

## 🚀 Deployment Steps

### Step 1: Build Docker Image

```bash
# Navigate to sentiment directory
cd sentiment

# Build the Docker image
docker build -t sentiment-service:latest .

# Test the image locally (optional)
docker run -p 3000:3000 sentiment-service:latest
```

### Step 2: Tag and Push to IBM Container Registry

```bash
# Tag the image for IBM Cloud Container Registry
docker tag sentiment-service:latest us.icr.io/sn-labs-zhao401/sentiment-service:latest

# Login to IBM Cloud
ibmcloud login

# Login to container registry
ibmcloud cr login

# Push the image
docker push us.icr.io/sn-labs-zhao401/sentiment-service:latest

# Verify the image
ibmcloud cr images --restrict sn-labs-zhao401
```

### Step 3: Deploy to Kubernetes

```bash
# Navigate to Deploy directory
cd ../Deploy

# Apply the deployment
kubectl apply -f sentiment-deployment.yml

# Verify deployment
kubectl get deployments
kubectl get pods -l app=sentiment-service
kubectl get services
```

### Step 4: Verify Deployment

```bash
# Check pod status
kubectl get pods -l app=sentiment-service

# Check logs
kubectl logs -l app=sentiment-service --tail=50

# Check service
kubectl get svc sentiment-service
kubectl get svc sentiment-service-nodeport

# Describe deployment for details
kubectl describe deployment sentiment-service
```

## 🔧 Configuration Details

### Environment Variables

The deployment sets these environment variables:

```yaml
env:
  - name: PORT
    value: "3000"
  - name: NODE_ENV
    value: "production"
```

### Resource Limits

```yaml
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi"
    cpu: "500m"
```

### Health Checks

**Liveness Probe:**
- Checks if container is alive
- HTTP GET to port 3000
- Initial delay: 30 seconds
- Period: 10 seconds

**Readiness Probe:**
- Checks if container is ready for traffic
- HTTP GET to port 3000
- Initial delay: 10 seconds
- Period: 5 seconds

### Security Context

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
```

## 🔌 Service Connectivity

### Internal Access (from Backend)

The backend should use the ClusterIP service:

```bash
# Service DNS name
sentiment-service.default.svc.cluster.local:3000

# Or simply
sentiment-service:3000
```

Update backend environment variable:
```yaml
env:
  - name: SENTIMENT_SERVICE_URL
    value: "http://sentiment-service:3000"
```

### External Access (Testing)

If you need to test from outside the cluster:

```bash
# Get the NodePort
kubectl get svc sentiment-service-nodeport

# Access via NodePort
curl http://<node-ip>:30009/sentiment \
  -H "Content-Type: application/json" \
  -d '{"sentence": "This is amazing!"}'
```

## 🧪 Testing the Deployment

### Test 1: Check Pod Health

```bash
# Get pod name
POD_NAME=$(kubectl get pods -l app=sentiment-service -o jsonpath='{.items[0].metadata.name}')

# Check logs
kubectl logs $POD_NAME

# Expected output: "Server running on port 3000"
```

### Test 2: Test Sentiment Analysis (Internal)

```bash
# Port forward to test locally
kubectl port-forward svc/sentiment-service 3000:3000

# In another terminal, test the endpoint
curl -X POST http://localhost:3000/sentiment \
  -H "Content-Type: application/json" \
  -d '{"sentence": "This is amazing! I love it!"}'

# Expected: {"sentimentScore": X, "sentiment": "positive", ...}
```

### Test 3: Test from Backend Pod

```bash
# Get backend pod name
BACKEND_POD=$(kubectl get pods -l app=giftapp -o jsonpath='{.items[0].metadata.name}')

# Execute curl from backend pod
kubectl exec $BACKEND_POD -- curl -X POST http://sentiment-service:3000/sentiment \
  -H "Content-Type: application/json" \
  -d '{"sentence": "i dont like this"}'

# Expected: {"sentimentScore": X, "sentiment": "negative", ...}
```

### Test 4: Verify High Availability

```bash
# Delete one pod to test replica recovery
kubectl delete pod -l app=sentiment-service --force --grace-period=0

# Watch pods - a new one should be created automatically
kubectl get pods -l app=sentiment-service -w
```

## 📊 Monitoring

### View Logs

```bash
# All pods
kubectl logs -l app=sentiment-service --tail=100

# Follow logs
kubectl logs -l app=sentiment-service -f

# Specific pod
kubectl logs <pod-name>
```

### Check Resource Usage

```bash
# CPU and memory usage
kubectl top pods -l app=sentiment-service

# Detailed pod information
kubectl describe pod -l app=sentiment-service
```

### Check Events

```bash
kubectl get events --sort-by='.lastTimestamp' | grep sentiment
```

## 🔄 Updating the Deployment

### Update Image

```bash
# Build new image with tag
docker build -t us.icr.io/sn-labs-zhao401/sentiment-service:v2 sentiment/
docker push us.icr.io/sn-labs-zhao401/sentiment-service:v2

# Update deployment
kubectl set image deployment/sentiment-service \
  sentiment-container=us.icr.io/sn-labs-zhao401/sentiment-service:v2

# Check rollout status
kubectl rollout status deployment/sentiment-service

# If needed, rollback
kubectl rollout undo deployment/sentiment-service
```

### Scale Replicas

```bash
# Scale up
kubectl scale deployment sentiment-service --replicas=3

# Scale down
kubectl scale deployment sentiment-service --replicas=1

# Verify
kubectl get deployment sentiment-service
```

### Update Configuration

```bash
# Edit the deployment file
vim Deploy/sentiment-deployment.yml

# Apply changes
kubectl apply -f Deploy/sentiment-deployment.yml

# Verify changes
kubectl get deployment sentiment-service -o yaml
```

## 🐛 Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -l app=sentiment-service

# Describe pod for events
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>

# Common issues:
# - Image pull errors: Check image name and registry credentials
# - CrashLoopBackOff: Check application logs
# - ImagePullBackOff: Verify image exists in registry
```

### Service Not Accessible

```bash
# Check service
kubectl get svc sentiment-service

# Check endpoints
kubectl get endpoints sentiment-service

# If no endpoints, check pod labels
kubectl get pods -l app=sentiment-service --show-labels

# Test from within cluster
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- \
  curl http://sentiment-service:3000/
```

### High Resource Usage

```bash
# Check resource usage
kubectl top pods -l app=sentiment-service

# If high, update resource limits
kubectl edit deployment sentiment-service

# Or update the YAML and reapply
```

## 🔐 Security Considerations

1. **Non-root User**: Runs as user 1000
2. **No Privilege Escalation**: `allowPrivilegeEscalation: false`
3. **Capabilities Dropped**: All capabilities dropped
4. **Seccomp Profile**: `RuntimeDefault` profile applied
5. **Image Pull Secrets**: Uses `icr` secret for private registry

## 🔗 Integration with Backend

Update backend deployment to use the sentiment service:

```yaml
# In Deploy/deployment.yml
env:
  - name: SENTIMENT_SERVICE_URL
    value: "http://sentiment-service:3000"
```

Or if using ConfigMap:

```bash
# Create ConfigMap
kubectl create configmap backend-config \
  --from-literal=SENTIMENT_SERVICE_URL=http://sentiment-service:3000

# Reference in deployment
env:
  - name: SENTIMENT_SERVICE_URL
    valueFrom:
      configMapKeyRef:
        name: backend-config
        key: SENTIMENT_SERVICE_URL
```

## 📋 Complete Deployment Commands

```bash
# 1. Build and push image
cd sentiment
docker build -t us.icr.io/sn-labs-zhao401/sentiment-service:latest .
docker push us.icr.io/sn-labs-zhao401/sentiment-service:latest

# 2. Deploy to Kubernetes
cd ../Deploy
kubectl apply -f sentiment-deployment.yml

# 3. Verify
kubectl get pods -l app=sentiment-service
kubectl get svc sentiment-service
kubectl logs -l app=sentiment-service --tail=20

# 4. Test
kubectl port-forward svc/sentiment-service 3000:3000
# In another terminal:
curl -X POST http://localhost:3000/sentiment \
  -H "Content-Type: application/json" \
  -d '{"sentence": "This is great!"}'
```

## ✅ Verification Checklist

- [ ] Docker image built successfully
- [ ] Image pushed to registry
- [ ] Deployment applied without errors
- [ ] 2 pods running and ready
- [ ] Service created with correct ports
- [ ] Health checks passing
- [ ] Can access service internally
- [ ] Backend can connect to sentiment service
- [ ] Sentiment analysis returning correct results
- [ ] Logs show no errors

## 📊 Service Architecture

```
┌─────────────────────────────────────────────────┐
│                 Kubernetes Cluster               │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  Backend Deployment (giftapp)             │  │
│  │  ┌──────────┐  ┌──────────┐             │  │
│  │  │  Pod 1   │  │  Pod 2   │             │  │
│  │  └────┬─────┘  └─────┬────┘             │  │
│  │       │               │                   │  │
│  └───────┼───────────────┼──────────────────┘  │
│          │               │                      │
│          └───────┬───────┘                      │
│                  │                              │
│                  ▼                              │
│  ┌──────────────────────────────────────────┐  │
│  │  Sentiment Service (ClusterIP)           │  │
│  │  sentiment-service:3000                  │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                               │
│          ┌──────┴──────┐                       │
│          ▼             ▼                       │
│  ┌──────────┐  ┌──────────┐                   │
│  │  Pod 1   │  │  Pod 2   │                   │
│  │  :3000   │  │  :3000   │                   │
│  └──────────┘  └──────────┘                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 🎯 Success Criteria

Your sentiment service is successfully deployed when:
- ✅ 2 replicas running and ready
- ✅ Health checks passing
- ✅ Service accessible from backend pods
- ✅ Sentiment analysis working correctly
- ✅ Logs show no errors
- ✅ Resource usage within limits
- ✅ High availability tested (pod deletion recovery)

---

**Status:** Ready for Deployment  
**Last Updated:** December 2024
