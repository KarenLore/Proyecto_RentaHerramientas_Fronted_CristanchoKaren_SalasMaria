// Importar las variables y funciones necesarias
import { API_URL, myHeaders } from "./enviroment.js"

// Clase para manejar la autenticación
class Auth {
  // Método para redirigir según el rol del usuario
  static redirectByRole(role) {
    switch (role) {
      case "ADMIN":
        window.location.href = "/Pages/admin/dashboard.html"
        break
      case "PROVIDER":
        window.location.href = "/Pages/provider/dashboard.html"
        break
      case "CLIENT":
        window.location.href = "/Pages/client/dashboard.html"
        break
      default:
        window.location.href = "/Pages/index.html"
    }
  }

  // Método para iniciar sesión
  static async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al iniciar sesión")
      }

      const data = await response.json()

      // Guardar token y datos del usuario
      localStorage.setItem("token", data.token)
      localStorage.setItem("refreshToken", data.refreshToken)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("tokenExpiration", Date.now() + 3600000) // 1 hora

      // Redirigir según el rol del usuario
      this.redirectByRole(data.user.role)

      return data
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      throw error
    }
  }

  // Método para registrar un nuevo usuario
  static async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al registrar usuario")
      }

      const data = await response.json()

      // Guardar token y datos del usuario
      localStorage.setItem("token", data.token)
      localStorage.setItem("refreshToken", data.refreshToken)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("tokenExpiration", Date.now() + 3600000) // 1 hora

      // Redirigir según el rol del usuario
      this.redirectByRole(data.user.role)

      return data
    } catch (error) {
      console.error("Error al registrar usuario:", error)
      throw error
    }
  }

  // Método para cerrar sesión
  static logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    localStorage.removeItem("tokenExpiration")

    // Redirigir a la página de inicio
    window.location.href = "/Pages/index.html"
  }

  // Método para verificar si el usuario está autenticado
  static isAuthenticated() {
    const token = localStorage.getItem("token")
    const expiration = localStorage.getItem("tokenExpiration")

    if (!token || !expiration) {
      return false
    }

    // Verificar si el token ha expirado
    if (Date.now() > Number.parseInt(expiration)) {
      this.logout()
      return false
    }

    return true
  }

  // Método para obtener el usuario actual
  static getCurrentUser() {
    const userJson = localStorage.getItem("user")
    return userJson ? JSON.parse(userJson) : null
  }

  // Método para verificar si el usuario tiene un rol específico
  static hasRole(role) {
    const user = this.getCurrentUser()
    return user && user.role === role
  }

  // Método para proteger páginas según el rol
  static protectPage(allowedRoles) {
    if (!this.isAuthenticated()) {
      window.location.href = "/Pages/login.html"
      return false
    }

    const user = this.getCurrentUser()

    if (!allowedRoles.includes(user.role)) {
      this.redirectByRole(user.role)
      return false
    }

    return true
  }

  // Método para actualizar el perfil del usuario
  static async updateProfile(userData) {
    try {
      const token = localStorage.getItem("token")
      const user = this.getCurrentUser()

      if (!token || !user) {
        throw new Error("No hay sesión activa")
      }

      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al actualizar perfil")
      }

      const updatedUser = await response.json()

      // Actualizar datos del usuario en localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser))

      return updatedUser
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      throw error
    }
  }

  // Método para cambiar la contraseña
  static async changePassword(currentPassword, newPassword) {
    try {
      const token = localStorage.getItem("token")
      const user = this.getCurrentUser()

      if (!token || !user) {
        throw new Error("No hay sesión activa")
      }

      const response = await fetch(`${API_URL}/users/${user.id}/change-password`, {
        method: "POST",
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al cambiar contraseña")
      }

      return await response.json()
    } catch (error) {
      console.error("Error al cambiar contraseña:", error)
      throw error
    }
  }
}

// Inicializar eventos de autenticación
document.addEventListener("DOMContentLoaded", () => {
  // Manejar formulario de inicio de sesión
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const loginError = document.getElementById("login-error")

      try {
        // Limpiar mensaje de error
        if (loginError) loginError.textContent = ""

        // Iniciar sesión
        await Auth.login(email, password)
      } catch (error) {
        console.error("Error al iniciar sesión:", error)

        // Mostrar mensaje de error
        if (loginError)
          loginError.textContent = error.message || "Error al iniciar sesión. Por favor, verifica tus credenciales."
      }
    })
  }

  // Manejar formulario de registro
  const registerForm = document.getElementById("register-form")
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm-password").value
      const role = document.getElementById("role").value
      const phone = document.getElementById("phone")?.value || ""
      const address = document.getElementById("address")?.value || ""
      const registerError = document.getElementById("register-error")

      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        if (registerError) registerError.textContent = "Las contraseñas no coinciden."
        return
      }

      try {
        // Limpiar mensaje de error
        if (registerError) registerError.textContent = ""

        // Crear objeto de usuario
        const userData = {
          name,
          email,
          password,
          role,
          phone,
          address,
        }

        // Registrar usuario
        await Auth.register(userData)
      } catch (error) {
        console.error("Error al registrar usuario:", error)

        // Mostrar mensaje de error
        if (registerError)
          registerError.textContent = error.message || "Error al registrar usuario. Por favor, intenta de nuevo."
      }
    })

    // Mostrar/ocultar campos adicionales según el rol
    const roleSelect = document.getElementById("role")
    const phoneContainer = document.getElementById("phone-container")
    const addressContainer = document.getElementById("address-container")

    if (roleSelect && phoneContainer && addressContainer) {
      roleSelect.addEventListener("change", () => {
        const selectedRole = roleSelect.value

        if (selectedRole === "PROVIDER") {
          phoneContainer.style.display = "block"
          addressContainer.style.display = "block"
        } else if (selectedRole === "CLIENT") {
          phoneContainer.style.display = "block"
          addressContainer.style.display = "none"
        } else {
          phoneContainer.style.display = "none"
          addressContainer.style.display = "none"
        }
      })
    }
  }

  // Manejar botones de mostrar/ocultar contraseña
  const togglePasswordButtons = document.querySelectorAll(".toggle-password")
  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input")
      const icon = button.querySelector("i")

      if (input.type === "password") {
        input.type = "text"
        icon.className = "fas fa-eye-slash"
      } else {
        input.type = "password"
        icon.className = "fas fa-eye"
      }
    })
  })

  // Manejar botones de cierre de sesión
  const logoutButtons = document.querySelectorAll("#logout-btn, #header-logout-btn")
  logoutButtons.forEach((button) => {
    if (button) {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        Auth.logout()
      })
    }
  })

  // Proteger páginas según el rol
  const currentPath = window.location.pathname

  if (currentPath.includes("/admin/")) {
    Auth.protectPage(["ADMIN"])
  } else if (currentPath.includes("/provider/")) {
    Auth.protectPage(["PROVIDER"])
  } else if (currentPath.includes("/client/")) {
    Auth.protectPage(["CLIENT"])
  }

  // Actualizar interfaz según el estado de autenticación
  const user = Auth.getCurrentUser()

  if (user) {
    // Actualizar nombre de usuario en la interfaz
    const userNameElements = document.querySelectorAll("#user-name, #header-user-name, #welcome-name")
    userNameElements.forEach((element) => {
      if (element) element.textContent = user.name || "Usuario"
    })

    // Actualizar avatar de usuario en la interfaz
    const userAvatarElements = document.querySelectorAll("#user-avatar, #header-avatar")
    userAvatarElements.forEach((element) => {
      if (element) element.src = user.avatar || "../../assets/avatar-placeholder.jpg"
    })

    // Actualizar rol de usuario en la interfaz
    const userRoleElements = document.querySelectorAll("#user-role")
    userRoleElements.forEach((element) => {
      if (element) {
        let roleText = "Usuario"

        switch (user.role) {
          case "ADMIN":
            roleText = "Administrador"
            break
          case "PROVIDER":
            roleText = "Proveedor"
            break
          case "CLIENT":
            roleText = "Cliente"
            break
        }

        element.textContent = roleText
      }
    })
  }
})

// Exportar la clase Auth para que esté disponible en otros archivos
export default Auth
