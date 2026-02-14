#  Setup Guide

Hey! Here's how to get this thing running. It's a standard MERN-ish stack (Next.js + Express).

## 1. Prerequisites
Make sure you have these running:
- **Node.js** (v18+)
- **MongoDB** (Local or Atlas)
- **Redis** (Local)

## 2. Backend (The API)
Head into the `backend` folder:
```bash
cd backend
npm install
```

Create a `.env` file (if you don't have one):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskdb
JWT_SECRET=supersecretkey
REDIS_URL=redis://localhost:6379
```

Start it up:
```bash
npm run dev # or npm start
```

Run tests (if you want to double-check):
```bash
npm test
# Check coverage
npm run test:coverage
```

## 3. Frontend (The UI)
Head into the `frontend` folder:
```bash
cd frontend
npm install
```

Start it:
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) and you're good to go!
