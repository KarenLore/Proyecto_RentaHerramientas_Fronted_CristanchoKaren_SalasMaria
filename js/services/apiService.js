// API Service for handling all API requests
const API_BASE_URL = "http://localhost:8080"

// Helper function for making API requests
async function fetchApi(endpoint, options = {}) {
  try {
    const token = localStorage.getItem("authToken")

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })

    // Handle non-JSON responses
    const contentType = response.headers.get("Content-Type")
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `API error: ${response.status}`)
      }

      return data
    } else {
      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `API error: ${response.status}`)
      }

      return null
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    throw error
  }
}

// API Service object with all API methods
export const apiService = {
  // Auth
  login: (email, password) => {
    return fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  register: (userData) => {
    return fetchApi("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  // Users
  getUsers: () => fetchApi("/api/users"),
  getUserById: (id) => fetchApi(`/api/users/${id}`),
  getUserByEmail: (email) => fetchApi(`/api/users/search?email=${email}`),
  createUser: (userData) => fetchApi("/api/users", { method: "POST", body: JSON.stringify(userData) }),
  updateUser: (id, userData) => fetchApi(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(userData) }),
  deleteUser: (id) => fetchApi(`/api/users/${id}`, { method: "DELETE" }),

  // Categories
  getCategories: () => fetchApi("/api/categories"),
  getCategoryById: (id) => fetchApi(`/api/categories/${id}`),
  createCategory: (categoryData) => fetchApi("/api/categories", { method: "POST", body: JSON.stringify(categoryData) }),
  updateCategory: (id, categoryData) =>
    fetchApi(`/api/categories/${id}`, { method: "PUT", body: JSON.stringify(categoryData) }),
  deleteCategory: (id) => fetchApi(`/api/categories/${id}`, { method: "DELETE" }),

  // Tools
  getTools: () => fetchApi("/api/tools"),
  getToolById: (id) => fetchApi(`/api/tools/${id}`),
  createTool: (toolData) => fetchApi("/api/tools", { method: "POST", body: JSON.stringify(toolData) }),
  updateTool: (id, toolData) => fetchApi(`/api/tools/${id}`, { method: "PUT", body: JSON.stringify(toolData) }),
  deleteTool: (id) => fetchApi(`/api/tools/${id}`, { method: "DELETE" }),

  // Reservations
  getReservations: () => fetchApi("/api/reservations"),
  getReservationById: (id) => fetchApi(`/api/reservations/${id}`),
  createReservation: (reservationData) =>
    fetchApi("/api/reservations", { method: "POST", body: JSON.stringify(reservationData) }),
  updateReservation: (id, reservationData) =>
    fetchApi(`/api/reservations/${id}`, { method: "PUT", body: JSON.stringify(reservationData) }),
  deleteReservation: (id) => fetchApi(`/api/reservations/${id}`, { method: "DELETE" }),

  // Invoices
  getInvoices: () => fetchApi("/api/invoices"),
  getInvoiceById: (id) => fetchApi(`/api/invoices/${id}`),
  createInvoice: (invoiceData) => fetchApi("/api/invoices", { method: "POST", body: JSON.stringify(invoiceData) }),
  getInvoiceByReservation: (reservationId) => fetchApi(`/api/invoices/reservation/${reservationId}`),

  // Payments
  getPayments: () => fetchApi("/payments"),
  getPaymentById: (id) => fetchApi(`/payments/${id}`),
  createPayment: (paymentData) => fetchApi("/payments", { method: "POST", body: JSON.stringify(paymentData) }),

  // Notifications
  getNotifications: () => fetchApi("/api/notifications/all"),
  getNotificationById: (id) => fetchApi(`/api/notifications/${id}`),
  createNotification: (notificationData) =>
    fetchApi("/api/notifications", { method: "POST", body: JSON.stringify(notificationData) }),
  deleteNotification: (id) => fetchApi(`/api/notifications/${id}`, { method: "DELETE" }),

  // Suppliers
  getSuppliers: () => fetchApi("/api/suppliers"),
  getSupplierById: (id) => fetchApi(`/api/suppliers/${id}`),
  createSupplier: (supplierData) => fetchApi("/api/suppliers", { method: "POST", body: JSON.stringify(supplierData) }),
  updateSupplier: (id, supplierData) =>
    fetchApi(`/api/suppliers/${id}`, { method: "PUT", body: JSON.stringify(supplierData) }),
  deleteSupplier: (id) => fetchApi(`/api/suppliers/${id}`, { method: "DELETE" }),
}
