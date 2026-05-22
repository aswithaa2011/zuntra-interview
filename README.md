# Pinvault — Pinterest-Style MERN App

A full-stack Pinterest-inspired visual discovery platform built with the MERN stack.

## Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS v4, React Router v7, Axios
- **Backend**: Node.js, Express 5, MongoDB (Mongoose), JWT, Bcrypt

## Features
- 🔐 JWT Authentication (Register/Login)
- 🖼️ Masonry grid layout with infinite scroll
- 💾 Save / unsave posts
- ❤️ Like posts
- 💬 Comments
- 🔍 Search & category filtering
- 👤 User profiles with bio/avatar editing
- 📱 Fully responsive (mobile-first)
- 🚀 Deployment-ready

## Getting Started

### 1. Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment
The `.env` files are pre-configured. Update `server/.env` with your MongoDB URI and JWT secret.

### 3. Start development
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend  
cd client && npm run dev
```

App runs at: **http://localhost:5173**
API runs at: **http://localhost:5000**

## Deployment

### Backend (Render / Railway / Fly.io)
1. Push server folder
2. Set env vars: `MONGO_URI`, `JWT_SECRET`, `PORT`
3. Build: `npm install`, Start: `node index.js`

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your deployed backend URL
2. Build: `npm run build`, Publish: `dist/`

## API Routes

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Get current user |
| PUT | /api/auth/profile | Yes | Update profile |

### Posts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/posts | No | Get all posts (paginated, filterable) |
| GET | /api/posts/:id | No | Get single post |
| POST | /api/posts | Yes | Create post |
| DELETE | /api/posts/:id | Yes | Delete own post |
| POST | /api/posts/:id/like | Yes | Toggle like |
| POST | /api/posts/:id/save | Yes | Toggle save |
| POST | /api/posts/:id/comment | Yes | Add comment |
| GET | /api/posts/user/:userId | No | Get user's posts |
| GET | /api/posts/saved | Yes | Get saved posts |
