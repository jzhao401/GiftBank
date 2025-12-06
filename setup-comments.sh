#!/bin/bash

# GiftBank Comments Feature - Quick Start Script
# This script helps you set up and test the comments feature

echo "=== GiftBank Comments Feature Setup ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a service is running
check_service() {
    local port=$1
    local service_name=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${GREEN}✓${NC} $service_name is running on port $port"
        return 0
    else
        echo -e "${RED}✗${NC} $service_name is NOT running on port $port"
        return 1
    fi
}

# Function to print section header
print_header() {
    echo ""
    echo -e "${YELLOW}=== $1 ===${NC}"
    echo ""
}

# Check services
print_header "Checking Services"

check_service 27017 "MongoDB"
MONGO_RUNNING=$?

check_service 3000 "Sentiment Service"
SENTIMENT_RUNNING=$?

check_service 3060 "Backend API"
BACKEND_RUNNING=$?

check_service 3001 "Frontend"
FRONTEND_RUNNING=$?

# Provide setup instructions if services aren't running
if [ $MONGO_RUNNING -ne 0 ] || [ $SENTIMENT_RUNNING -ne 0 ] || [ $BACKEND_RUNNING -ne 0 ] || [ $FRONTEND_RUNNING -ne 0 ]; then
    print_header "Setup Instructions"
    
    if [ $MONGO_RUNNING -ne 0 ]; then
        echo "Start MongoDB:"
        echo "  mongod --dbpath=$(pwd)/db"
        echo ""
    fi
    
    if [ $SENTIMENT_RUNNING -ne 0 ]; then
        echo "Start Sentiment Service:"
        echo "  cd sentiment"
        echo "  npm install  # if not already installed"
        echo "  npm start"
        echo ""
    fi
    
    if [ $BACKEND_RUNNING -ne 0 ]; then
        echo "Start Backend:"
        echo "  cd giftlink-backend"
        echo "  npm install  # if not already installed"
        echo "  npm start"
        echo ""
    fi
    
    if [ $FRONTEND_RUNNING -ne 0 ]; then
        echo "Start Frontend:"
        echo "  cd giftlink-frontend"
        echo "  npm install  # if not already installed"
        echo "  npm start"
        echo ""
    fi
fi

# Option to add sample comments
print_header "Database Setup"

echo "Would you like to add sample comments to your gift items? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    if [ $MONGO_RUNNING -eq 0 ]; then
        echo ""
        echo "Adding sample comments to database..."
        cd giftlink-backend
        node util/add-sample-comments.js
        cd ..
        echo ""
        echo -e "${GREEN}✓${NC} Sample comments added successfully!"
    else
        echo -e "${RED}✗${NC} MongoDB must be running to add sample comments"
    fi
fi

# Testing instructions
print_header "Testing the Comments Feature"

echo "1. Open your browser and navigate to: http://localhost:3001"
echo "2. Log in to your account"
echo "3. Click on any gift item to view its details"
echo "4. You should see existing comments with sentiment badges (positive/negative/neutral)"
echo "5. Try adding a new comment - it will be analyzed for sentiment automatically"
echo ""
echo "Comment examples to test sentiment analysis:"
echo "  Positive: 'This is amazing! I love it!'"
echo "  Negative: 'This looks terrible and broken.'"
echo "  Neutral: 'Is this still available?'"

print_header "Documentation"

echo "For detailed information, see: COMMENTS_FEATURE.md"
echo ""
echo "API Endpoints:"
echo "  GET  /api/comments/:giftId  - Get all comments for a gift"
echo "  POST /api/comments/:giftId  - Add a new comment"

print_header "Complete!"

echo "All setup information has been displayed."
echo "Run this script again anytime to check service status."
echo ""
