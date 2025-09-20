# Social Media App

A simple MERN stack social media application with the following features:
- User registration and profile editing
- Create, edit, and delete posts with images
- Like and unlike posts (shows like count)
- Comment on posts (add, edit, delete)
- Follow and unfollow users
- View all users and their profiles

## Project Structure

- `backend/` — Express.js API, MongoDB models, image upload, REST endpoints
- `frontend/` — React app (Vite), routes for posts, users, and profile

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
# Set up .env with your MongoDB URI (see .env.example)
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on [http://localhost:5173](http://localhost:5173) and proxies API requests to the backend on port 5000.

## Usage

- Register users via API or MongoDB directly (no auth UI yet)
- Create posts with images
- Like/unlike and comment on posts
- Edit your profile and follow/unfollow other users

## Notes

- Images are stored in the backend `/uploads` folder.
- Update the hardcoded user ID in the frontend for full functionality.
- No authentication implemented (for demo purposes).

---
Built with MERN stack.
