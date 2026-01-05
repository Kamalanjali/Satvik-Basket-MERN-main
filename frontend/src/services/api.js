import axios from "axios";

// ===============================
// Base API Configuration
// ===============================
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 🔥 REQUIRED for HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// NOTE:
// ❌ NO localStorage tokens
// ❌ NO Authorization headers
// ❌ NO auth interceptors
//
// Auth is server-driven via cookies
// ===============================


// ===============================
// Auth API
// ===============================
export const authApi = {
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
  resetPassword: (data) =>
    api.post("/auth/reset-password", data),
};


// ===============================
// User API  ✅ NEW (REQUIRED)
// ===============================
export const userApi = {
  updateProfile: (data) => api.put("/auth/me", data),
};


// ===============================
// Product API
// ===============================
export const productApi = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  search: (query) =>
    api.get("/products/search", { params: { q: query } }),
};


// ===============================
// Order API
// ===============================
export const orderApi = {
  create: (orderData) => api.post("/orders", orderData),
  getMyOrders: () => api.get("/orders/my-orders"),
  getAll: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
};


// ===============================
// Payment API
// ===============================
export const paymentApi = {
  createRazorpayOrder: (data) =>
    api.post("/payments/razorpay/create", data),

  verifyRazorpayPayment: (data) =>
    api.post("/payments/razorpay/verify", data),
};
