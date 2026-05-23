# 🐛 Tracer Web App

A full-stack Issue Tracking application built with **React + Vite** (Frontend) and **Node.js + Express + MongoDB** (Backend). Supports full CRUD operations, JWT authentication, email verification, search & filter, pagination, activity logging, and CSV export.


## Features

### Core
- Create, view, update, and delete issues
- Issue fields: title, description, status, priority, severity
- Status tracking: Open → In Progress → Resolved → Closed
- Visual status and priority badges with color indicators
- Dashboard with issue counts by status
- Activity log on each issue (tracks status and priority changes)
- Search issues by title (debounced — optimized API requests)
- Filter by priority and status
- Pagination (10 issues per page)
- Export issue list to CSV

### Authentication
- User registration and login with email & password
- Email verification on registration (via Resend)
- Secure password hashing with bcrypt
- JWT-based authentication (7-day expiry)
- Protected routes — login required to access issues

### Frontend
- Responsive design with Tailwind CSS
- Reusable components (StatusBadge, IssueCard, SearchBar, ConfirmModal, Navbar)
- Global state management with Zustand
- Toast notifications for all actions
- Confirmation modals for destructive actions (delete, close, resolve)

## Deployment

This application is deployed using the following services:

- **Frontend:** Netlify  
- **Backend:** Render  

### Note on Backend Availability

The backend service is hosted on Render's free-tier plan. Due to free-tier limitations, the server may enter a sleep state when inactive for a period of time. When this occurs, the initial request may experience a short delay while the server wakes up. Once active, the application functions normally with standard response times.


##  Tech Stack
## Frontend
React + Vite - UI framework
Tailwind CSS - Styling and responsive design
Zustand - Global state management
Axios - HTTP requests
React Router - Client-side routing
React Hot Toast - Notifications

## Backend
Node.js + Express - REST API server
MongoDB + Mongoose - Database
JWT - Authentication tokens
bcrypt - Password hashing
Nodemailer - Email verification
crypto (built-in) - Token generation


## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Gmail account with App Password enabled

### 1. Clone the repository

git clone https://github.com/yourusername/issue-tracker.git
cd issue-tracker


### 2. Backend Setup & Install Dependencies

cd backend
npm install

Create a `.env` file in the `backend` folder:

PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/issuetracker?appName=Cluster0
LOCAL_CLIENT_URL=http://localhost:5173
CLIENT_URL=https://tracer-app.netlify.app
RESEND_API_KEY=re_6MNPqKP6_NNzsVLPpk1FpCrCiHWZ253Gm
JWT_SECRET=issuetracker_secret_key_2024_xyz789


**How to get Resend API Key:**
 1. Go to [resend.com](https://resend.com) and sign up
 2. Go to **API Keys** → click **"Create API Key"**
 3. Copy the API key and paste it as `RESEND_API_KEY`

Start the backend:

npm run dev

Server runs on Local `http://localhost:8000`
Server runs on Prod `https://issue-tracker-api-4kd5.onrender.com`


### 3. Frontend Setup & Install Dependencies

cd frontend
npm install

Create a `.env` file in the `frontend` folder:

VITE_API_URL_LOCAL=http://localhost:8000/api
VITE_API_URL=https://issue-tracker-api-4kd5.onrender.com/


Start the frontend:

npm run dev

App runs on LOCAL `http://localhost:5173`
App runs on PROD `https://tracer-app.netlify.app`



## API Endpoints

## Auth
POST /api/auth/register - Register new user (No authentication required)
POST /api/auth/login - Login user (No authentication required)
GET /api/auth/verify-email?token= - Verify email (No authentication required)
POST /api/auth/check-verified - Check verification status (No authentication required)

## Issues
GET /api/issues - Get all issues with search, filter, and pagination (Authentication required)
GET /api/issues/counts - Get issue counts by status (Authentication required)
GET /api/issues/:id - Get a single issue (Authentication required)
POST /api/issues - Create a new issue (Authentication required)
PUT /api/issues/:id - Update an existing issue (Authentication required)
DELETE /api/issues/:id - Delete an issue (Authentication required)

## Query Parameters for GET /api/issues
?search=login - Search issues by title
?priority=High - Filter issues by priority
?status=Open - Filter issues by status
?page=2 - Specify page number
?limit=10 - Set number of results per page

## Running Tests

### Backend Tests

cd backend
npm test


Covers:
- Auth controller (register, login, email verification)
- Issue controller (CRUD, search, pagination, activity log)



## Design Decisions
MongoDB over MySQL - Faster setup and flexible schema for activity logs
Zustand over Redux - Simpler API, less boilerplate, sufficient for this app size
Debounced search - Prevents API spam by waiting 500ms after the user stops typing
JWT in localStorage - Simple implementation; httpOnly cookies would provide better security in production
Nodemailer + Gmail - No third-party paid service needed for email verification
Tailwind CSS - Utility-first approach with built-in responsive design and no CSS file conflicts


## 👤 Author

**Mihinsa Nakandala**  
Built as part of a technical assignment.