# 🧺 Satvik Basket – MERN E-Commerce Application

Satvik Basket is a full-stack e-commerce application built using the **MERN stack**, focused on real-world payment flows, order lifecycle handling, and clean backend architecture.  
The project emphasizes **correctness over shortcuts**, especially in payment processing and order management.

---

## 🚀 Features

### 🛍️ User Features
- User authentication (JWT-based)
- Browse products and add to cart
- Address management during checkout
- Secure checkout with **Razorpay (Test Mode)**
- Retry payment for pending orders
- Order history with expandable order details
- Real-time order payment status updates

---

### 💳 Payments (Razorpay – Test Mode)
- Backend-driven Razorpay order creation
- Secure signature verification using HMAC
- Payment status persisted in database
- Correct handling of:
  - Payment success
  - Payment failure
  - User-cancelled payments
- Retry payment option for pending orders
- Idempotent verification (safe against double callbacks)

> ⚠️ Razorpay is integrated in **test mode only**, as this is a portfolio project.  
> Live keys are **not required** and intentionally not configured.

---

### 📦 Order Lifecycle
- Order creation before payment
- Payment status tracking:
  - `PENDING`
  - `PAID`
  - `FAILED`
- Order status tracking:
  - `CREATED`
  - `CONFIRMED`
  - (future: SHIPPED, DELIVERED)

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Tailwind CSS
- react-hot-toast (notifications)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Razorpay Node SDK

---

## 🗂️ Project Structure

Satvik-Basket-MERN
├── backend
│ ├── controllers
│ ├── models
│ ├── routes
│ ├── middleware
│ └── config
│
├── frontend
│ ├── src
│ │ ├── pages
│ │ ├── components
│ │ ├── services
│ │ └── utils
│ └── index.html


---

## ⚙️ Environment Setup

### Backend `.env`

PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=rzp_test_xxxxx

RAZORPAY_KEY_SECRET=your_test_secret


### Frontend `.env`

VITE_API_BASE_URL=http://localhost:3000/api/v1

VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx


---

## ▶️ Running Locally

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
---
### 🧪 Razorpay Testing

Use Razorpay test card details:

Card Number: 4111 1111 1111 1111

Expiry: Any future date

CVV: Any 3 digits

OTP: 123456

---

### 🧠 Engineering Highlights

- Backend is the single source of truth for payment status
- No frontend-only payment assumptions
- Payment verification updates both Payment and Order documents atomically
- Safe handling of edge cases like:
    - Cancelled payment after popup opens
    - Double verification attempts
-Clean separation of concerns between UI, API, and business logic

---

### 📌 Future Enhancements

- Stock management & inventory locking
- Admin dashboard (products, orders, analytics)
- Order shipment tracking
- Google OAuth login
- Email notifications
---

### 👩‍💻 Author

Lakshmi Kamalanjali Mandalika
Full Stack Engineer | MERN | Cloud Fundamentals

---

### 📄 License

This project is for learning and portfolio purposes.
