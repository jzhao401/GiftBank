#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     GiftBank Test Environment Setup       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"

# Check if MongoDB is running
echo -e "\n${YELLOW}Checking MongoDB...${NC}"
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
else
    echo -e "${RED}✗ MongoDB is NOT running${NC}"
    echo -e "${YELLOW}Start MongoDB with: mongod --dbpath /path/to/data${NC}"
    exit 1
fi

# Check if backend is running
echo -e "\n${YELLOW}Checking Backend (port 3060)...${NC}"
if lsof -Pi :3060 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✓ Backend is running on port 3060${NC}"
else
    echo -e "${RED}✗ Backend is NOT running${NC}"
    echo -e "${YELLOW}Start backend with: cd giftlink-backend && npm start${NC}"
    exit 1
fi

# Install test dependencies
echo -e "\n${YELLOW}Checking test dependencies...${NC}"
cd "$(dirname "$0")" || exit
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Run tests
echo -e "\n${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          Running Integration Tests         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}\n"

node frontend-profile-test.js
