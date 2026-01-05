import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ===============================
   Auth API
================================ */
export const authApi = {
  login: async (data) => {
    const res = await api.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    return res;
  },

  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },

  me: () => api.get("/auth/me"),

  resetPassword: async (data) => {
    const res = await api.post("/auth/reset-password", data);
    localStorage.setItem("token", res.data.token);
    return res;
  },
};

/* ===============================
   User API
================================ */
export const userApi = {
  updateProfile: (data) => api.put("/auth/me", data),
};

/* ===============================
   Product API
================================ */
export const productApi = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
};

/* ===============================
   Order API
================================ */
export const orderApi = {
  create: (data) => api.post("/orders", data),
  getMyOrders: () => api.get("/orders/my-orders"),
};

/* ===============================
   Payment API
================================ */
export const paymentApi = {
  createRazorpayOrder: (data) =>
    api.post("/payments/razorpay/create", data),
  verifyRazorpayPayment: (data) =>
    api.post("/payments/razorpay/verify", data),
};
