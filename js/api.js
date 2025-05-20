// Define API_URL and myHeaders
const API_URL = "http://localhost:8080/api" // Replace with your actual API URL
const myHeaders = {
  "Content-Type": "application/json",
  // Add any other default headers here
}

// API Service
class API {
  static async request(endpoint, method = "GET", data = null, requiresAuth = true) {
    try {
      const url = `${API_URL}${endpoint}`
      const headers = { ...myHeaders }

      if (requiresAuth) {
        const token = localStorage.getItem("token")
        if (token) {
          headers.Authorization = `Bearer ${token}`
        } else {
          throw new Error("No hay token de autenticación")
        }
      }

      const config = {
        method,
        headers,
        mode: "cors",
      }

      if (data && (method === "POST" || method === "PUT")) {
        config.body = JSON.stringify(data)
      }

      const response = await fetch(url, config)

      // Si la respuesta es 401 (No autorizado), redirigir al login
      if (response.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/Pages/login.html"
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

  // Métodos para realizar peticiones HTTP
  static async get(endpoint, requiresAuth = true) {
    return this.request(endpoint, "GET", null, requiresAuth)
  }

  static async post(endpoint, data, requiresAuth = true) {
    return this.request(endpoint, "POST", data, requiresAuth)
  }

  static async put(endpoint, data, requiresAuth = true) {
    return this.request(endpoint, "PUT", data, requiresAuth)
  }

  static async delete(endpoint, requiresAuth = true) {
    return this.request(endpoint, "DELETE", null, requiresAuth)
  }
}

// Exportar la clase API para que esté disponible en otros archivos
if (typeof module !== "undefined" && module.exports) {
  module.exports = API
} else {
  window.API = API
}
