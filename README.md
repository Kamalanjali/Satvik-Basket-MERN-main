# 🛒 Satvik Basket

A full-stack MERN e-commerce platform bringing traditional Indian kitchen essentials online.

🌐 **Live Demo:** https://satvikbasket.vercel.app  
⚠️ *Backend is hosted on a free-tier service and may take a few seconds to wake up on first request.*

---

## 🚀 Features

### 🔐 Authentication
- Google OAuth 2.0 login
- Email/password authentication
- JWT-based stateless authentication
- Protected routes
- Password reset & update flow
- Secure token-based session handling

### 🛍 E-Commerce Flow
- Product listing & filtering
- Add to cart
- Protected checkout
- Address management (CRUD)
- Order creation
- Order history
- Order ownership validation

### 💳 Payments
- Razorpay payment integration
- Secure order verification
- Reload-safe order success page
- Payment status handling

### 🧠 Architecture Highlights
- Stateless JWT auth (no sessions, no cookies)
- Backend ownership validation for orders
- OAuth callback handling via backend
- Environment-based configuration management
- Production-ready deployment setup

---

## 🏗 Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Tailwind CSS
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Passport.js (Google OAuth)
- JWT Authentication

### External Services
- Google OAuth 2.0
- Razorpay
- MongoDB Atlas

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 🔁 Authentication Flow

1. User logs in via Google or email.
2. Backend generates JWT.
3. Token stored in `localStorage`.
4. Frontend attaches token in Authorization header.
5. Backend verifies JWT on protected routes.

**No sessions. No cookies. Fully stateless authentication.**

---

## 💳 Payment Flow

1. User adds products to cart.
2. Checkout requires authentication.
3. Order created with `PENDING` payment status.
4. Razorpay checkout initiated.
5. On success:
   - Payment verified
   - Order status updated
   - Redirect to `/order-success/:orderId`
6. Order success page is reload-safe.

---

## 📂 Project Structure

Satvik-Basket/
│
├── frontend/ # React + Vite app
├── backend/ # Express server
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── models/
│ └── config/
│
└── README.md


---

## ⚙️ Environment Variables

### Backend (.env)

PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=your_backend_callback_url
CLIENT_URL=your_frontend_url

RAZORPAY_KEY_ID=your_key
RAZORPAY_SECRET=your_secret


### Frontend (.env)

VITE_API_BASE_URL=https://your-backend-url/api/v1


---

## 🧪 Running Locally

### Backend
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev

---

## 🔒 Security Considerations

1) JWT-based authentication
2) Route-level protection middleware
3) Order ownership verification
4) Password hashing with bcrypt
5) Environment variable separation for production
6) No sensitive secrets stored in repository

---

## 📈 Future Improvements

1) Admin dashboard for order management
2) Inventory management
3) Email notifications
4) Payment failure retry handling
5) Product analytics dashboard

---

### 👩‍💻 Author

Kamalanjali
