#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🎬 Movie Box Backend Setup${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please update .env with your database credentials${NC}"
    echo ""
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    echo "Please install PostgreSQL first:"
    echo "  brew install postgresql"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL is installed${NC}"

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Create database if it doesn't exist
echo -e "${YELLOW}Creating database '$DB_DATABASE'...${NC}"
psql -U $DB_USERNAME -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_DATABASE'" | grep -q 1 || psql -U $DB_USERNAME -c "CREATE DATABASE $DB_DATABASE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database '$DB_DATABASE' is ready${NC}"
else
    echo -e "${RED}❌ Failed to create database${NC}"
    echo "Please create the database manually:"
    echo "  createdb -U $DB_USERNAME $DB_DATABASE"
    exit 1
fi

echo ""
echo -e "${GREEN}🚀 Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Start the development server: npm run start:dev"
echo "  2. View API docs: http://localhost:3000/api/docs"
echo ""
