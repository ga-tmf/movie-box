# Movie Box

A full-stack movie management application for adding, editing, and browsing movies with poster images.

## Tech Stack

- **Backend**: NestJS, TypeORM, PostgreSQL
- **Frontend**: React, TanStack Router, Zustand, Material-UI
- **Deployment**: Docker & Docker Compose

## Features

- Movie CRUD operations with poster upload
- Image dimension validation (portrait orientation required)
- Server-side pagination
- JWT authentication
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js (for local development)

### Running with Docker

```bash
# Start backend and database
cd backend
docker-compose up

# Start frontend (in another terminal)
cd frontend
npm install
npm run dev
```

The backend will run on `http://localhost:4000` and frontend on `http://localhost:5173`.

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend** (`backend/.env`):
```
DATABASE_URL=postgresql://user:password@localhost:5432/moviedb
JWT_SECRET=your-secret-key
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:4000
```

## Default Credentials

- **Email**: demo@demo.com
- **Password**: demo123
