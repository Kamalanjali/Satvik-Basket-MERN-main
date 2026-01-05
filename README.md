# Satvik Basket (Develop Branch)

Satvik Basket is a full-stack e-commerce application built using the MERN stack, focused on clean architecture, real-world workflows, and production-ready practices.

This **develop** branch is used for active development and testing before changes are promoted to production.

---

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Vite
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Passport.js (Google OAuth)
- JWT Authentication

### Infrastructure
- Backend: Railway
- Frontend: Vercel
- Database: MongoDB Atlas

---

## Branch Strategy

- `develop`
  - Active development branch
  - All features, fixes, and refactors land here first
  - Deployed to a staging environment

- `main`
  - Production branch
  - Only stable, production-ready code
  - Deployment is triggered via Pull Request merge from `develop`

---

## Current Features

- User authentication (JWT + Google OAuth)
- Product listing and categories
- Cart and checkout flow
- Address management
- Order creation and status handling
- Guarded Razorpay integration (enabled only when env vars are present)
- Backend-safe startup with optional services disabled when env vars are missing

---

## Environment Configuration

The backend is designed to **fail gracefully** when optional environment variables are missing.

Required environment variables:
- MONGO_URI
- JWT_SECRET

optional (feature - based):
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET


If optional variables are missing, related features are disabled without crashing the server.

---

## Deployment Flow

1. Code is developed and tested on the `develop` branch
2. A Pull Request is raised from `develop` → `main`
3. CI checks and deployments run automatically
4. On successful verification, the PR is merged
5. Merge to `main` triggers production deployment

---

## Status

- Backend: Deployed on Railway
- Frontend: Deployed on Vercel
- CI/CD: GitHub Pull Request based workflow

---

## Notes

This project is intentionally structured to reflect real-world team workflows, including branch discipline, environment safety, and deployment verification.

