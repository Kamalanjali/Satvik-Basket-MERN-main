# 🛒 Satvik Basket

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Express](https://img.shields.io/badge/API-Express-black)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Render](https://img.shields.io/badge/Backend%20Deployment-Render-purple)
![Vercel](https://img.shields.io/badge/Frontend%20Deployment-Vercel-black)

A production-oriented full-stack MERN e-commerce platform for traditional Indian kitchen essentials.

Built with a strong focus on:
- scalable backend architecture
- production engineering practices
- operational monitoring
- authentication security
- reliability and maintainability

🌐 **Live Demo:** [Satvik Basket](https://satvikbasket.vercel.app)

📡 Production monitoring enabled using Sentry and UptimeRobot.

⚠️ Backend is hosted on a free-tier service and may take a few seconds to wake up on the first request.

---

# 🎯 Project Goal

The goal of Satvik Basket is not only to build a functional e-commerce platform, but also to progressively evolve it into a production-oriented MERN application with real-world backend engineering practices including monitoring, security hardening, validation, logging, and operational reliability.

---

# 📚 Table of Contents

- [Features](#-features)
- [Production Engineering Improvements](#-production-engineering-improvements)
- [Tech Stack](#-tech-stack)
- [Authentication Flow](#-authentication-flow)
- [Payment Flow](#-payment-flow)
- [Monitoring & Health Checks](#-monitoring--health-checks)
- [Backend Architecture](#-backend-architecture)
- [Project Structure](#-project-structure)
- [Environment Variables](#️-environment-variables)
- [Running Locally](#-running-locally)
- [Security Considerations](#-security-considerations)
- [Future Improvements](#-future-improvements)

---

# 🚀 Features

## 🔐 Authentication & Authorization

- Google OAuth 2.0 authentication
- Email/password authentication
- JWT-based stateless authentication
- Protected routes
- Password reset flow
- User profile update flow
- Secure token-based API authorization
- Route-level authorization middleware

---

## 🛍 E-Commerce Functionality

- Product listing
- Product filtering
- Add to cart
- Cart persistence
- Protected checkout flow
- Address management (CRUD)
- Order creation and management
- Order history
- Order ownership validation
- Reload-safe order success flow

---

## 💳 Payment Integration

- Razorpay payment gateway integration
- Secure payment verification
- Payment status handling
- Backend payment verification
- Order/payment synchronization

---

# 🛠 Production Engineering Improvements

This project was progressively refactored from a basic MERN application into a more production-oriented full-stack system.

---

## ✅ Backend Reliability

- Centralized error handling middleware
- Consistent API response structure
- Async error wrapper utilities
- Graceful shutdown handling
- Process-level exception handling
- Production-safe error masking

---

## ✅ Validation & API Safety

- Zod-based request validation
- Validation middleware before controllers
- Safer payload handling
- Consistent validation error responses
- Cleaner request lifecycle architecture

---

## ✅ Security Hardening

- Helmet security headers
- API rate limiting
- HPP (HTTP Parameter Pollution) protection
- JWT authentication hardening
- Request payload size limiting
- Sensitive header redaction in logs
- Secure environment variable handling

---

## ✅ Monitoring & Observability

- Structured request logging using Pino
- Sentry integration for runtime exception monitoring
- `/health` endpoint for operational diagnostics
- UptimeRobot uptime monitoring
- Request lifecycle visibility
- Production diagnostics and debugging support

---

## ✅ Operational Improvements

- Cleaner middleware architecture
- Improved backend request flow
- Better auth flow handling
- Faster and more stable product loading
- Improved production debugging workflow

---

# 🏗 Tech Stack

## Frontend

- React (Vite)
- React Router
- Axios
- Tailwind CSS
- React Hot Toast

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- JWT Authentication
- Zod Validation
- Pino Logger

---

## External Services

- Google OAuth 2.0
- Razorpay
- MongoDB Atlas
- Sentry
- UptimeRobot

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

# 🔁 Authentication Flow

1. User logs in using Google OAuth or email/password.
2. Backend generates JWT token.
3. Token stored in `localStorage`.
4. Frontend attaches JWT in Authorization header.
5. Backend validates JWT on protected routes.

---

## Authentication Architecture

- Stateless authentication
- No server-side sessions
- No cookies
- Token-based authorization flow

---

# 💳 Payment Flow

1. User adds products to cart.
2. Checkout requires authentication.
3. Backend creates order with `PENDING` payment state.
4. Razorpay checkout session starts.
5. Payment verification handled on backend.
6. Order updated after successful verification.
7. User redirected to reload-safe success page.

---

# 📡 Monitoring & Health Checks

## Health Endpoint

The backend exposes a production health endpoint:

```http
GET /health
```

Returns:
- API status
- Database connection status
- Server uptime
- Runtime diagnostics
- Timestamp

---

## Monitoring Stack

### Sentry

Used for:
- runtime exception tracking
- stack trace debugging
- production diagnostics

---

### UptimeRobot

Used for:
- uptime monitoring
- downtime detection
- operational heartbeat checks

---

### Pino

Used for:
- structured request logging
- request tracing
- backend diagnostics

---

# 🧠 Backend Architecture

```txt
Client
↓
Express Server
↓
Security Middleware
(helmet, hpp, rate limiting)
↓
Pino Request Logging
↓
Validation Layer (Zod)
↓
Controllers
↓
MongoDB
↓
Centralized Error Middleware
↓
Sentry + Logs
```

---

# 📂 Project Structure

```txt
Satvik-Basket/
│
├── frontend/
│   └── React + Vite frontend
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── validations/
│   └── server.js
│
└── README.md
```

---

# ⚙️ Environment Variables

## Backend (.env)

```env
PORT=3000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=your_backend_callback_url

CLIENT_URL=your_frontend_url

RAZORPAY_KEY_ID=your_key
RAZORPAY_SECRET=your_secret

SENTRY_DSN=your_sentry_dsn
```

---

## Frontend (.env)

```env
VITE_API_BASE_URL=https://your-backend-url/api/v1
```

---

# 🧪 Running Locally

## Backend

```bash
cd backend
npm install
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🔒 Security Considerations

- JWT-based authentication
- Route-level authorization middleware
- Order ownership validation
- Password hashing using bcrypt
- Rate limiting against abuse
- Security headers using Helmet
- Request payload limits
- Environment variable separation
- Sensitive log redaction
- Stateless backend architecture

---

# 📈 Future Improvements

## Backend

- Database indexing optimization
- Pagination and caching
- API performance optimization
- Background job processing
- Advanced monitoring

---

## Frontend

- Skeleton loading states
- Better mobile responsiveness
- Improved accessibility
- Better empty/error states

---

## DevOps & Engineering

- CI/CD pipeline
- Dockerization
- Automated testing
- API documentation
- Performance analytics

---

# 👩‍💻 Author

### Kamalanjali

Full-stack developer focused on:
- Backend engineering
- Production systems
- Scalable web applications
- Cloud & operational tooling

🔗 LinkedIn:
https://www.linkedin.com/in/mlkamalanjali/

---