import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
}

// Menu API
export const menuAPI = {
  getMenu: (params) => api.get('/menu', { params }),
  getMenuItem: (id) => api.get(`/menu/${id}`),
  getCategories: () => api.get('/menu/categories'),
  createMenuItem: (data) => api.post('/menu', data),
  updateMenuItem: (id, data) => api.put(`/menu/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/menu/${id}`),
  addRating: (id, rating, comment) => api.post(`/menu/${id}/rating`, { rating, comment }),
}

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status, notes) => api.put(`/orders/${id}/status`, { status, notes }),
  addFeedback: (id, rating, comment) => api.post(`/orders/${id}/feedback`, { rating, comment }),
  getAllOrders: (params) => api.get('/orders/admin/all', { params }),
}

// Reservations API
export const reservationsAPI = {
  createReservation: (reservationData) => api.post('/reservations', reservationData),
  getReservations: (params) => api.get('/reservations', { params }),
  updateReservationStatus: (id, status, notes) => api.put(`/reservations/${id}/status`, { status, notes }),
  cancelReservation: (id) => api.delete(`/reservations/${id}`),
  getAllReservations: (params) => api.get('/reservations/admin/all', { params }),
}

// Payments API
export const paymentsAPI = {
  createPaymentIntent: (orderId, amount) => api.post('/payments/create-payment-intent', { orderId, amount }),
  confirmPayment: (orderId, paymentIntentId) => api.post('/payments/confirm', { orderId, paymentIntentId }),
  processRefund: (orderId, amount) => api.post('/payments/refund', { orderId, amount }),
}

// Chatbot API
export const chatbotAPI = {
  sendMessage: (message, orderId) => api.post('/chatbot/chat', { message, orderId }),
  getSuggestions: (params) => api.get('/chatbot/suggestions', { params }),
  getFAQ: () => api.get('/chatbot/faq'),
}

// Admin API
export const adminAPI = {
  getDashboard: (params) => api.get('/admin/dashboard', { params }),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive }),
  getSalesAnalytics: (params) => api.get('/admin/analytics/sales', { params }),
  getCustomerAnalytics: (params) => api.get('/admin/analytics/customers', { params }),
}

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (currentPassword, newPassword) => api.post('/users/change-password', { currentPassword, newPassword }),
  getUserOrders: (params) => api.get('/users/orders', { params }),
  getLoyaltyPoints: () => api.get('/users/loyalty-points'),
}

export default api
