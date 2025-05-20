// API Configuration
const API_CONFIG = {
  BASE_URL: "http://localhost:8080/api", // Cambia esto a la URL de tu API
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
    },
    TOOLS: {
      BASE: "/tools",
      BY_ID: (id) => `/tools/${id}`,
      BY_CATEGORY: (categoryId) => `/tools?category=${categoryId}`,
      STATUS: (id) => `/tools/${id}/status`,
    },
    CATEGORIES: {
      BASE: "/categories",
      BY_ID: (id) => `/categories/${id}`,
    },
    RESERVATIONS: {
      BASE: "/reservations",
      BY_ID: (id) => `/reservations/${id}`,
      BY_CLIENT: (clientId) => `/reservations?clientId=${clientId}`,
    },
    PAYMENTS: {
      BASE: "/payments",
      BY_ID: (id) => `/payments/${id}`,
    },
    RETURNS: {
      BASE: "/returns",
      BY_ID: (id) => `/returns/${id}`,
    },
    USERS: {
      BASE: "/users",
      BY_ID: (id) => `/users/${id}`,
    },
    NOTIFICATIONS: {
      BASE: "/notifications",
      BY_ID: (id) => `/notifications/${id}`,
      BY_USER: (userId) => `/notifications/user/${userId}`,
    },
    HISTORY: {
      BASE: "/histories",
      BY_USER: (userId) => `/histories?userId=${userId}`,
    },
  },
  HEADERS: {
    "Content-Type": "application/json",
  },
}

// Función para obtener el token de autenticación
function getAuthToken() {
  return localStorage.getItem("authToken")
}

// Función para agregar el token de autenticación a los headers
function getAuthHeaders() {
  const token = getAuthToken()
  if (token) {
    return {
      ...API_CONFIG.HEADERS,
      Authorization: `Bearer ${token}`,
    }
  }
  return API_CONFIG.HEADERS
}

// Función para realizar peticiones a la API
async function apiRequest(endpoint, method = "GET", data = null, requiresAuth = true) {
  try {
    const headers = requiresAuth ? getAuthHeaders() : API_CONFIG.HEADERS
    const config = {
      method,
      headers,
    }

    if (data && (method === "POST" || method === "PUT")) {
      config.body = JSON.stringify(data)
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, config)

    // Si la respuesta es 401 (No autorizado), redirigir al login
    if (response.status === 401) {
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      window.location.href = "/login.html"
      return null
    }

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error en la petición")
    }

    // Si la respuesta es 204 (No Content), retornar null
    if (response.status === 204) {
      return null
    }

    // Parsear la respuesta como JSON
    return await response.json()
  } catch (error) {
    console.error("Error en la petición:", error)
    throw error
  }
}
