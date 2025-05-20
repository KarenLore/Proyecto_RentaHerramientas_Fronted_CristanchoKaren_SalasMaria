// Importar las variables y funciones necesarias
import { API_URL, myHeaders } from "../enviroment.js"
import Auth from "../auth.js"
import { formatPrice, createStars } from "../main.js"

// Variables globales
let userData = null

// Función para cargar datos del dashboard
async function loadDashboardData() {
  try {
    // Verificar autenticación
    if (!Auth.isAuthenticated()) {
      window.location.href = "../login.html"
      return
    }

    // Obtener usuario actual
    userData = Auth.getCurrentUser()

    // Actualizar nombre de bienvenida
    const welcomeName = document.getElementById("welcome-name")
    if (welcomeName) welcomeName.textContent = userData.name

    // Cargar estadísticas
    loadStats()

    // Cargar reservas activas
    loadActiveReservations()

    // Cargar herramientas recomendadas
    loadFeaturedTools()

    // Cargar actividad reciente
    loadRecentActivity()

    // Cargar próximas devoluciones
    loadUpcomingReturns()
  } catch (error) {
    console.error("Error al cargar datos del dashboard:", error)
  }
}

// Función para cargar estadísticas
async function loadStats() {
  try {
    const token = localStorage.getItem("token")

    // Realizar petición para obtener estadísticas
    const response = await fetch(`${API_URL}/clients/${userData.id}/stats`, {
      method: "GET",
      headers: {
        ...myHeaders,
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al cargar estadísticas")
    }

    const stats = await response.json()

    // Actualizar estadísticas en la interfaz
    const activeReservationsElement = document.getElementById("active-reservations")
    const totalReservationsElement = document.getElementById("total-reservations")
    const totalSpentElement = document.getElementById("total-spent")
    const toolsRentedElement = document.getElementById("tools-rented")

    if (activeReservationsElement) activeReservationsElement.textContent = stats.activeReservations || 0
    if (totalReservationsElement) totalReservationsElement.textContent = stats.totalReservations || 0
    if (totalSpentElement) totalSpentElement.textContent = formatPrice(stats.totalSpent || 0)
    if (toolsRentedElement) toolsRentedElement.textContent = stats.toolsRented || 0
  } catch (error) {
    console.error("Error al cargar estadísticas:", error)
  }
}

// Función para cargar reservas activas
async function loadActiveReservations() {
  const activeReservationsList = document.getElementById("active-reservations-list")
  const activeReservationsLoader = document.getElementById("active-reservations-loader")

  if (!activeReservationsList) return

  try {
    // Mostrar loader
    if (activeReservationsLoader) activeReservationsLoader.style.display = "block"

    const token = localStorage.getItem("token")

    // Realizar petición para obtener reservas activas
    const response = await fetch(`${API_URL}/clients/${userData.id}/reservations/active`, {
      method: "GET",
      headers: {
        ...myHeaders,
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al cargar reservas activas")
    }

    const reservations = await response.json()

    // Ocultar loader
    if (activeReservationsLoader) activeReservationsLoader.style.display = "none"

    // Limpiar contenedor
    activeReservationsList.innerHTML = ""

    // Mostrar mensaje si no hay reservas activas
    if (reservations.length === 0) {
      activeReservationsList.innerHTML = `
        <div class="empty-state">
          <p>No tienes reservas activas en este momento.</p>
          <a href="browse-tools.html" class="btn btn-primary btn-sm">Buscar Herramientas</a>
        </div>
      `
      return
    }

    // Mostrar reservas activas
    reservations.forEach((reservation) => {
      const reservationItem = document.createElement("div")
      reservationItem.className = "reservation-item"

      const startDate = new Date(reservation.startDate).toLocaleDateString()
      const endDate = new Date(reservation.endDate).toLocaleDateString()

      reservationItem.innerHTML = `
        <div class="reservation-header">
          <h4>${reservation.tool.name}</h4>
          <div class="reservation-dates">${startDate} - ${endDate}</div>
        </div>
        <div class="reservation-details">
          <p><strong>Proveedor:</strong> ${reservation.tool.provider.name}</p>
          <p><strong>Estado:</strong> <span class="status-badge status-active">${getReservationStatusText(reservation.status)}</span></p>
          <p><strong>Total:</strong> ${formatPrice(reservation.totalPrice)}</p>
        </div>
        <div class="reservation-actions">
          <button class="btn btn-primary btn-sm view-reservation" data-id="${reservation.id}">Ver Detalles</button>
        </div>
      `

      // Agregar evento para ver detalles
      const viewButton = reservationItem.querySelector(".view-reservation")
      if (viewButton) {
        viewButton.addEventListener("click", () => {
          showReservationDetails(reservation)
        })
      }

      activeReservationsList.appendChild(reservationItem)
    })
  } catch (error) {
    console.error("Error al cargar reservas activas:", error)

    // Ocultar loader
    if (activeReservationsLoader) activeReservationsLoader.style.display = "none"

    // Mostrar mensaje de error
    if (activeReservationsList) {
      activeReservationsList.innerHTML = `
        <div class="error-message">
          <p>Error al cargar reservas activas. Por favor, intenta de nuevo más tarde.</p>
        </div>
      `
    }
  }
}

// Función para cargar herramientas recomendadas
async function loadFeaturedTools() {
  const featuredToolsGrid = document.getElementById("featured-tools-grid")
  const featuredToolsLoader = document.getElementById("featured-tools-loader")

  if (!featuredToolsGrid) return

  try {
    // Mostrar loader
    if (featuredToolsLoader) featuredToolsLoader.style.display = "block"

    // Realizar petición para obtener herramientas recomendadas
    const response = await fetch(`${API_URL}/tools/featured?size=4`, {
      method: "GET",
      headers: myHeaders,
    })

    if (!response.ok) {
      throw new Error("Error al cargar herramientas recomendadas")
    }

    const data = await response.json()
    const tools = data.content || data

    // Ocultar loader
    if (featuredToolsLoader) featuredToolsLoader.style.display = "none"

    // Limpiar contenedor
    featuredToolsGrid.innerHTML = ""

    // Mostrar mensaje si no hay herramientas recomendadas
    if (tools.length === 0) {
      featuredToolsGrid.innerHTML = `
        <div class="empty-state">
          <p>No hay herramientas recomendadas en este momento.</p>
        </div>
      `
      return
    }

    // Mostrar herramientas recomendadas
    tools.forEach((tool) => {
      const toolCard = document.createElement("div")
      toolCard.className = "tool-card"

      const imageUrl = tool.imageUrl || "/images/herramientas.png"

      toolCard.innerHTML = `
        <div class="tool-image">
          <img src="${imageUrl}" alt="${tool.name}">
        </div>
        <div class="tool-content">
          <h3>${tool.name}</h3>
          <div class="tool-rating">
            <div class="stars"></div>
            <span>(${tool.reviews || 0} reseñas)</span>
          </div>
          <div class="tool-price">${formatPrice(tool.rentalCost || tool.price || 0)}<span>/día</span></div>
          <a href="browse-tools.html?id=${tool.id}" class="btn btn-outline btn-sm">Ver Detalles</a>
        </div>
      `

      // Agregar estrellas
      const starsContainer = toolCard.querySelector(".stars")
      const stars = createStars(tool.rating || 4.5)
      starsContainer.appendChild(stars)

      featuredToolsGrid.appendChild(toolCard)
    })
  } catch (error) {
    console.error("Error al cargar herramientas recomendadas:", error)

    // Ocultar loader
    if (featuredToolsLoader) featuredToolsLoader.style.display = "none"

    // Mostrar mensaje de error
    if (featuredToolsGrid) {
      featuredToolsGrid.innerHTML = `
        <div class="error-message">
          <p>Error al cargar herramientas recomendadas. Por favor, intenta de nuevo más tarde.</p>
        </div>
      `
    }
  }
}

// Función para cargar actividad reciente
async function loadRecentActivity() {
  const activityList = document.getElementById("activity-list")
  const activityLoader = document.getElementById("activity-loader")

  if (!activityList) return

  try {
    // Mostrar loader
    if (activityLoader) activityLoader.style.display = "block"

    const token = localStorage.getItem("token")

    // Realizar petición para obtener actividad reciente
    const response = await fetch(`${API_URL}/clients/${userData.id}/activity`, {
      method: "GET",
      headers: {
        ...myHeaders,
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al cargar actividad reciente")
    }

    const activities = await response.json()

    // Ocultar loader
    if (activityLoader) activityLoader.style.display = "none"

    // Limpiar contenedor
    activityList.innerHTML = ""

    // Mostrar mensaje si no hay actividad reciente
    if (activities.length === 0) {
      activityList.innerHTML = `
        <div class="empty-state">
          <p>No hay actividad reciente.</p>
        </div>
      `
      return
    }

    // Mostrar actividad reciente
    activities.forEach((activity) => {
      const activityItem = document.createElement("div")
      activityItem.className = "activity-item"

      const date = new Date(activity.timestamp).toLocaleDateString()
      const time = new Date(activity.timestamp).toLocaleTimeString()

      activityItem.innerHTML = `
        <div class="activity-icon">
          <i class="${getActivityIcon(activity.type)}"></i>
        </div>
        <div class="activity-content">
          <p>${activity.description}</p>
          <span class="activity-time">${date} ${time}</span>
        </div>
      `

      activityList.appendChild(activityItem)
    })
  } catch (error) {
    console.error("Error al cargar actividad reciente:", error)

    // Ocultar loader
    if (activityLoader) activityLoader.style.display = "none"

    // Mostrar mensaje de error
    if (activityList) {
      activityList.innerHTML = `
        <div class="error-message">
          <p>Error al cargar actividad reciente. Por favor, intenta de nuevo más tarde.</p>
        </div>
      `
    }
  }
}

// Función para cargar próximas devoluciones
async function loadUpcomingReturns() {
  const upcomingReturnsList = document.getElementById("upcoming-returns-list")
  const upcomingReturnsLoader = document.getElementById("upcoming-returns-loader")

  if (!upcomingReturnsList) return

  try {
    // Mostrar loader
    if (upcomingReturnsLoader) upcomingReturnsLoader.style.display = "block"

    const token = localStorage.getItem("token")

    // Realizar petición para obtener próximas devoluciones
    const response = await fetch(`${API_URL}/clients/${userData.id}/returns/upcoming`, {
      method: "GET",
      headers: {
        ...myHeaders,
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al cargar próximas devoluciones")
    }

    const returns = await response.json()

    // Ocultar loader
    if (upcomingReturnsLoader) upcomingReturnsLoader.style.display = "none"

    // Limpiar contenedor
    upcomingReturnsList.innerHTML = ""

    // Mostrar mensaje si no hay próximas devoluciones
    if (returns.length === 0) {
      upcomingReturnsList.innerHTML = `
        <div class="empty-state">
          <p>No tienes próximas devoluciones.</p>
        </div>
      `
      return
    }

    // Mostrar próximas devoluciones
    returns.forEach((returnItem) => {
      const returnElement = document.createElement("div")
      returnElement.className = "return-item"

      const endDate = new Date(returnItem.reservation.endDate).toLocaleDateString()
      const daysLeft = Math.ceil((new Date(returnItem.reservation.endDate) - new Date()) / (1000 * 60 * 60 * 24))

      returnElement.innerHTML = `
        <div class="return-header">
          <h4>${returnItem.reservation.tool.name}</h4>
          <div class="return-date">Fecha de devolución: ${endDate}</div>
        </div>
        <div class="return-details">
          <p><strong>Días restantes:</strong> ${daysLeft}</p>
          <p><strong>Proveedor:</strong> ${returnItem.reservation.tool.provider.name}</p>
        </div>
        <div class="return-actions">
          <button class="btn btn-primary btn-sm view-reservation" data-id="${returnItem.reservation.id}">Ver Detalles</button>
        </div>
      `

      // Agregar evento para ver detalles
      const viewButton = returnElement.querySelector(".view-reservation")
      if (viewButton) {
        viewButton.addEventListener("click", () => {
          showReservationDetails(returnItem.reservation)
        })
      }

      upcomingReturnsList.appendChild(returnElement)
    })
  } catch (error) {
    console.error("Error al cargar próximas devoluciones:", error)

    // Ocultar loader
    if (upcomingReturnsLoader) upcomingReturnsLoader.style.display = "none"

    // Mostrar mensaje de error
    if (upcomingReturnsList) {
      upcomingReturnsList.innerHTML = `
        <div class="error-message">
          <p>Error al cargar próximas devoluciones. Por favor, intenta de nuevo más tarde.</p>
        </div>
      `
    }
  }
}

// Función para mostrar detalles de una reserva
function showReservationDetails(reservation) {
  const modal = document.getElementById("reservation-modal")
  const modalBody = modal.querySelector(".modal-body")

  // Formatear fechas
  const startDate = new Date(reservation.startDate).toLocaleDateString()
  const endDate = new Date(reservation.endDate).toLocaleDateString()

  // Calcular días
  const days = Math.ceil((new Date(reservation.endDate) - new Date(reservation.startDate)) / (1000 * 60 * 60 * 24))

  // Crear contenido del modal
  modalBody.innerHTML = `
    <div class="reservation-details-modal">
      <div class="tool-info">
        <img src="${reservation.tool.imageUrl || "/images/herramientas.png"}" alt="${reservation.tool.name}" class="tool-image">
        <div>
          <h3>${reservation.tool.name}</h3>
          <p><strong>Categoría:</strong> ${reservation.tool.category?.name || "Sin categoría"}</p>
          <p><strong>Proveedor:</strong> ${reservation.tool.provider.name}</p>
        </div>
      </div>
      <div class="reservation-info">
        <div class="info-group">
          <h4>Detalles de la Reserva</h4>
          <p><strong>ID de Reserva:</strong> ${reservation.id}</p>
          <p><strong>Estado:</strong> <span class="status-badge status-${reservation.status.toLowerCase()}">${getReservationStatusText(reservation.status)}</span></p>
          <p><strong>Fecha de Inicio:</strong> ${startDate}</p>
          <p><strong>Fecha de Fin:</strong> ${endDate}</p>
          <p><strong>Duración:</strong> ${days} día(s)</p>
        </div>
        <div class="info-group">
          <h4>Detalles de Pago</h4>
          <p><strong>Precio por día:</strong> ${formatPrice(reservation.tool.rentalCost || reservation.tool.price || 0)}</p>
          <p><strong>Total:</strong> ${formatPrice(reservation.totalPrice)}</p>
          <p><strong>Método de Pago:</strong> ${reservation.paymentMethod || "No especificado"}</p>
        </div>
      </div>
      <div class="reservation-actions-modal">
        ${
          reservation.status === "ACTIVE"
            ? `
          <button class="btn btn-danger cancel-reservation" data-id="${reservation.id}">Cancelar Reserva</button>
        `
            : ""
        }
        <button class="btn btn-primary contact-provider" data-email="${reservation.tool.provider.email}">Contactar Proveedor</button>
      </div>
    </div>
  `

  // Agregar eventos a los botones
  const cancelButton = modalBody.querySelector(".cancel-reservation")
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      cancelReservation(reservation.id)
    })
  }

  const contactButton = modalBody.querySelector(".contact-provider")
  if (contactButton) {
    contactButton.addEventListener("click", () => {
      const email = contactButton.dataset.email
      window.location.href = `mailto:${email}?subject=Consulta sobre reserva ${reservation.id}`
    })
  }

  // Mostrar modal
  modal.classList.add("active")

  // Agregar evento para cerrar modal
  const closeButton = modal.querySelector(".modal-close")
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      modal.classList.remove("active")
    })
  }

  // Cerrar modal al hacer clic fuera
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active")
    }
  })
}

// Función para cancelar una reserva
async function cancelReservation(reservationId) {
  try {
    const token = localStorage.getItem("token")

    // Confirmar cancelación
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.")) {
      return
    }

    // Realizar petición para cancelar reserva
    const response = await fetch(`${API_URL}/reservations/${reservationId}/cancel`, {
      method: "PUT",
      headers: {
        ...myHeaders,
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al cancelar reserva")
    }

    // Cerrar modal
    const modal = document.getElementById("reservation-modal")
    if (modal) modal.classList.remove("active")

    // Recargar datos
    loadDashboardData()

    // Mostrar mensaje de éxito
    alert("Reserva cancelada con éxito.")
  } catch (error) {
    console.error("Error al cancelar reserva:", error)
    alert("Error al cancelar reserva. Por favor, intenta de nuevo más tarde.")
  }
}

// Función para obtener texto de estado de reserva
function getReservationStatusText(status) {
  switch (status) {
    case "PENDING":
      return "Pendiente"
    case "CONFIRMED":
      return "Confirmada"
    case "ACTIVE":
      return "Activa"
    case "COMPLETED":
      return "Completada"
    case "CANCELLED":
      return "Cancelada"
    default:
      return status
  }
}

// Función para obtener icono de actividad
function getActivityIcon(type) {
  switch (type) {
    case "RESERVATION_CREATED":
      return "fas fa-calendar-plus"
    case "RESERVATION_CONFIRMED":
      return "fas fa-check-circle"
    case "RESERVATION_CANCELLED":
      return "fas fa-times-circle"
    case "PAYMENT_MADE":
      return "fas fa-money-bill-wave"
    case "TOOL_RETURNED":
      return "fas fa-undo"
    default:
      return "fas fa-history"
  }
}

// Inicializar menú móvil
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle")
  const sidebar = document.getElementById("sidebar")
  const sidebarClose = document.getElementById("sidebar-close")

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.add("active")
    })
  }

  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener("click", () => {
      sidebar.classList.remove("active")
    })
  }
}

// Inicializar menú de usuario
function initUserMenu() {
  const userMenu = document.getElementById("user-menu")
  const userDropdown = document.getElementById("user-dropdown")

  if (userMenu && userDropdown) {
    userMenu.addEventListener("click", () => {
      userDropdown.classList.toggle("active")
    })

    // Cerrar al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!userMenu.contains(e.target)) {
        userDropdown.classList.remove("active")
      }
    })
  }
}

// Inicializar notificaciones
function initNotifications() {
  const notificationBell = document.getElementById("notification-bell")
  const notificationDropdown = document.getElementById("notification-dropdown")
  const markAllReadButton = document.getElementById("mark-all-read")

  if (notificationBell && notificationDropdown) {
    notificationBell.addEventListener("click", () => {
      notificationDropdown.classList.toggle("active")
      loadNotifications()
    })

    // Cerrar al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!notificationBell.contains(e.target)) {
        notificationDropdown.classList.remove("active")
      }
    })
  }

  if (markAllReadButton) {
    markAllReadButton.addEventListener("click", markAllNotificationsAsRead)
  }
}

// Función para cargar notificaciones
async function loadNotifications() {
  const notificationList = document.getElementById("notification-list")
  const notificationCount = document.getElementById("notification-count")

  if (!notificationList) return

  try {
    const token = localStorage.getItem("token")

    // Realizar petición para obtener notificaciones
    const response = await fetch(`${API_URL}/notifications/user/${userData.id}`, {
      method: "GET",
      headers: {
        ...myHeaders,
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al cargar notificaciones")
    }

    const notifications = await response.json()

    // Limpiar contenedor
    notificationList.innerHTML = ""

    // Actualizar contador
    const unreadCount = notifications.filter((n) => !n.read).length
    if (notificationCount) notificationCount.textContent = unreadCount

    // Mostrar mensaje si no hay notificaciones
    if (notifications.length === 0) {
      notificationList.innerHTML = `
        <div class="empty-state">
          <p>No tienes notificaciones.</p>
        </div>
      `
      return
    }

    // Mostrar notificaciones
    notifications.forEach((notification) => {
      const notificationItem = document.createElement("div")
      notificationItem.className = `notification-item ${notification.read ? "" : "unread"}`

      const date = new Date(notification.createdAt).toLocaleDateString()
      const time = new Date(notification.createdAt).toLocaleTimeString()

      notificationItem.innerHTML = `
        <div class="notification-icon">
          <i class="${getNotificationIcon(notification.type)}"></i>
        </div>
        <div class="notification-content">
          <p>${notification.message}</p>
          <span class="notification-time">${date} ${time}</span>
        </div>
      `

      // Marcar como leída al hacer clic
      notificationItem.addEventListener("click", () => {
        markNotificationAsRead(notification.id)
        notificationItem.classList.remove("unread")
      })

      notificationList.appendChild(notificationItem)
    })
  } catch (error) {
    console.error("Error al cargar notificaciones:", error)

    // Mostrar mensaje de error
    if (notificationList) {
      notificationList.innerHTML = `
        <div class="error-message">
          <p>Error al cargar notificaciones. Por favor, intenta de nuevo más tarde.</p>
        </div>
      `
    }
  }
}

// Función para marcar notificación como leída
async function markNotificationAsRead(notificationId) {
  try {
    const token = localStorage.getItem("token")

    // Realizar petición para marcar notificación como leída
    await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: {
        ...myHeaders,
        Authorization: `Bearer ${token}`,
      },
    })

    // Actualizar contador
    const notificationCount = document.getElementById("notification-count")
    if (notificationCount) {
      const currentCount = Number.parseInt(notificationCount.textContent)
      notificationCount.textContent = Math.max(0, currentCount - 1)
    }
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error)
  }
}

// Función para marcar todas las notificaciones como leídas
async function markAllNotificationsAsRead() {
  try {
    const token = localStorage.getItem("token")

    // Realizar petición para marcar todas las notificaciones como leídas
    await fetch(`${API_URL}/notifications/user/${userData.id}/read-all`, {
      method: "PUT",
      headers: {
        ...myHeaders,
        Authorization: `Bearer ${token}`,
      },
    })

    // Actualizar interfaz
    const notificationItems = document.querySelectorAll(".notification-item")
    notificationItems.forEach((item) => item.classList.remove("unread"))

    // Actualizar contador
    const notificationCount = document.getElementById("notification-count")
    if (notificationCount) notificationCount.textContent = "0"
  } catch (error) {
    console.error("Error al marcar todas las notificaciones como leídas:", error)
  }
}

// Función para obtener icono de notificación
function getNotificationIcon(type) {
  switch (type) {
    case "RESERVATION_CONFIRMED":
      return "fas fa-check-circle"
    case "RESERVATION_CANCELLED":
      return "fas fa-times-circle"
    case "PAYMENT_CONFIRMED":
      return "fas fa-money-bill-wave"
    case "RETURN_REMINDER":
      return "fas fa-exclamation-circle"
    case "TOOL_AVAILABLE":
      return "fas fa-tools"
    default:
      return "fas fa-bell"
  }
}

// Inicializar página
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu()
  initUserMenu()
  initNotifications()
  loadDashboardData()
})
