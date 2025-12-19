### 🧺 Satvik Basket – MERN E-Commerce Backend

Satvik Basket is a backend-first MERN e-commerce application designed for selling traditional, satvik home-made food products such as ghee, oils, spice mixes, and batters.
This repository currently focuses on a robust, production-style backend with clean architecture, authentication, authorization, and core e-commerce flows.

Frontend integration is planned as the next phase.

---

## 🚀 Features Implemented (Backend)

# 🔐 Authentication & Authorization

- User registration and login with JWT-based authentication
- Role-based access control (USER, ADMIN)
- Protected routes using middleware
- Admin-only routes for product and order management

# 🧱 Core E-Commerce Modules

- Users – register, login, role management
- Products
- Create product (admin-only)
- Get all products
- Get product by ID
- Orders
- Create order (user/admin)
- Get logged-in user’s orders
- Get all orders (admin-only)
- Payments (Mock Implementation)
- Create payment
- Mark payment as success
- Mark payment as failed

---

# 🛡️ Middleware & Infrastructure

- Global error handling middleware
- JWT auth middleware
- Admin/role-based middleware
- Environment-based configuration
- MongoDB connection with Mongoose
- Clean separation of routes, controllers, models, and middlewares

---

# 🧰 Tech Stack

- Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- dotenv
- Tools
- Thunder Client / Postman (API testing)
- Nodemon
  
---

# 📁 Project Structure

backend/
└── src/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── product.controller.js
    │   ├── order.controller.js
    │   └── payment.controller.js
    ├── middlewares/
    │   ├── auth.middleware.js
    │   ├── role.middleware.js
    │   └── error.middleware.js
    ├── models/
    │   ├── user.model.js
    │   ├── product.model.js
    │   ├── order.model.js
    │   └── payment.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── product.routes.js
    │   ├── order.routes.js
    │   └── payment.routes.js
    ├── utils/
    │   └── constants.js
    └── server.js

---

## ⚙️ Environment Variables

Create a .env file in the backend root:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development


.env is ignored via .gitignore

---

## ▶️ Running the Backend Locally

cd backend
npm install
npm run dev


Server will run on:

http://localhost:3000

---

## 🧪 API Testing

All APIs have been tested using Thunder Client.

- Auth Flow
- Register user
- Login user
- Copy JWT token

Use token in Authorization header for protected routes

Authorization: Bearer <JWT_TOKEN>

---

## 📌 Notes

- Payments are mocked intentionally to decouple order flow from real gateways
- Error handling is centralized and environment-aware
- Backend is designed to be frozen while frontend is developed
- Frontend integration will reuse and adapt an existing UI

---

## 🛠️ Upcoming Work

- Frontend development (React)
- UI integration with existing design
- Cart and checkout flow
- Deployment

---

## 👩‍💻 Author

Built with care and clarity as a learning-focused, real-world MERN project.
