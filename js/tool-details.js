// Importar las variables y funciones necesarias
import { API_URL, myHeaders } from "./enviroment.js"
import { formatPrice, createStars } from "./main.js"

// Variables globales
let toolId = null
let toolData = null

// Función para obtener parámetros de la URL
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}

// Función para cargar los detalles de la herramienta
async function loadToolDetails() {
  // Obtener ID de la herramienta de la URL
  toolId = getUrlParameter("id")

  if (!toolId) {
    window.location.href = "catalog.html"
    return
  }

  const toolLoading = document.getElementById("tool-loading")
  const toolDetails = document.getElementById("tool-details")

  try {
    // Mostrar spinner de carga
    if (toolLoading) toolLoading.style.display = "flex"
    if (toolDetails) toolDetails.style.display = "none"

    // Realizar petición
    const response = await fetch(`${API_URL}/tools/${toolId}`, {
      method: "GET",
      headers: myHeaders,
    })

    if (!response.ok) {
      throw new Error("Error al cargar detalles de la herramienta")
    }

    toolData = await response.json()

    // Actualizar breadcrumb
    updateBreadcrumb(toolData)

    // Actualizar detalles de la herramienta
    updateToolDetails(toolData)

    // Cargar herramientas similares
    loadSimilarTools(toolData.category?.id)

    // Ocultar spinner y mostrar detalles
    if (toolLoading) toolLoading.style.display = "none"
    if (toolDetails) toolDetails.style.display = "grid"
  } catch (error) {
    console.error("Error al cargar detalles de la herramienta:", error)

    // Mostrar mensaje de error
    if (toolLoading) {
      toolLoading.innerHTML = `
        <div class="error-message">
          <p>Error al cargar detalles de la herramienta. Por favor, intenta de nuevo más tarde.</p>
          <a href="catalog.html" class="btn btn-primary">Volver al catálogo</a>
        </div>
      `
    }
  }
}

// Función para actualizar el breadcrumb
function updateBreadcrumb(tool) {
  const toolCategory = document.getElementById("tool-category")
  const toolName = document.getElementById("tool-name")

  if (toolCategory && tool.category) {
    toolCategory.innerHTML = `<a href="catalog.html?category=${tool.category.id}">${tool.category.name}</a>`
  }

  if (toolName) {
    toolName.textContent = tool.name
  }
}

// Función para actualizar los detalles de la herramienta
function updateToolDetails(tool) {
  // Actualizar título
  const toolTitle = document.getElementById("tool-title")
  if (toolTitle) toolTitle.textContent = tool.name

  // Actualizar categoría
  const toolCategoryBadge = document.getElementById("tool-category-badge")
  if (toolCategoryBadge && tool.category) toolCategoryBadge.textContent = tool.category.name

  // Actualizar precio
  const toolPrice = document.getElementById("tool-price")
  if (toolPrice) toolPrice.textContent = formatPrice(tool.rentalCost || tool.price || 0)

  // Actualizar estado
  const toolStatus = document.getElementById("tool-status")
  if (toolStatus) {
    const statusClass =
      tool.status === "AVAILABLE" || tool.status === "DISPONIBLE"
        ? "available"
        : tool.status === "RENTED" || tool.status === "ALQUILADO"
          ? "rented"
          : "maintenance"

    const statusText =
      tool.status === "AVAILABLE" || tool.status === "DISPONIBLE"
        ? "Disponible"
        : tool.status === "RENTED" || tool.status === "ALQUILADO"
          ? "Alquilado"
          : "En Mantenimiento"

    toolStatus.textContent = statusText
    toolStatus.className = `status-badge status-${statusClass}`
  }

  // Actualizar descripción
  const toolDescription = document.getElementById("tool-description")
  if (toolDescription) toolDescription.textContent = tool.description || "No hay descripción disponible."

  // Actualizar imagen principal
  const toolMainImage = document.getElementById("tool-main-image")
  if (toolMainImage) toolMainImage.src = tool.imageUrl || "/images/herramientas.png"

  // Actualizar miniaturas
  const thumbnailContainer = document.getElementById("thumbnail-container")
  if (thumbnailContainer) {
    thumbnailContainer.innerHTML = ""

    // Agregar imagen principal como primera miniatura
    const mainThumbnail = document.createElement("div")
    mainThumbnail.className = "thumbnail active"
    mainThumbnail.innerHTML = `<img src="${tool.imageUrl || "/images/herramientas.png"}" alt="${tool.name}">`
    mainThumbnail.addEventListener("click", () => {
      if (toolMainImage) toolMainImage.src = tool.imageUrl || "/images/herramientas.png"

      // Actualizar clase active
      document.querySelectorAll(".thumbnail").forEach((thumb) => thumb.classList.remove("active"))
      mainThumbnail.classList.add("active")
    })
    thumbnailContainer.appendChild(mainThumbnail)

    // Agregar imágenes adicionales si existen
    if (tool.images && tool.images.length > 0) {
      tool.images.forEach((image, index) => {
        const thumbnail = document.createElement("div")
        thumbnail.className = "thumbnail"
        thumbnail.innerHTML = `<img src="${image.url}" alt="${tool.name} - Imagen ${index + 1}">`
        thumbnail.addEventListener("click", () => {
          if (toolMainImage) toolMainImage.src = image.url

          // Actualizar clase active
          document.querySelectorAll(".thumbnail").forEach((thumb) => thumb.classList.remove("active"))
          thumbnail.classList.add("active")
        })
        thumbnailContainer.appendChild(thumbnail)
      })
    }
  }

  // Actualizar información del proveedor
  const providerName = document.getElementById("provider-name")
  const providerContact = document.getElementById("provider-contact")

  if (providerName && tool.provider) providerName.textContent = tool.provider.name || "Proveedor"
  if (providerContact && tool.provider) providerContact.textContent = tool.provider.email || "Contacto no disponible"

  // Configurar formulario de reserva
  setupReservationForm(tool)
}

// Función para configurar el formulario de reserva
function setupReservationForm(tool) {
  const reservationForm = document.getElementById("reservation-form")
  const loginRequired = document.getElementById("login-required")
  const startDateInput = document.getElementById("start-date")
  const endDateInput = document.getElementById("end-date")
  const daysCount = document.getElementById("days-count")
  const dayPrice = document.getElementById("day-price")
  const totalPrice = document.getElementById("total-price")
  const reserveButton = document.getElementById("reserve-button")
  const reservationError = document.getElementById("reservation-error")

  // Verificar si el usuario está autenticado
  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null

  if (!token || !user) {
    // Usuario no autenticado
    if (reservationForm) reservationForm.style.display = "none"
    if (loginRequired) loginRequired.style.display = "block"
    return
  }

  // Usuario autenticado
  if (reservationForm) reservationForm.style.display = "block"
  if (loginRequired) loginRequired.style.display = "none"

  // Verificar si la herramienta está disponible
  if (tool.status !== "AVAILABLE" && tool.status !== "DISPONIBLE") {
    if (reserveButton) {
      reserveButton.disabled = true
      reserveButton.textContent = "No disponible"
    }

    if (reservationError) {
      reservationError.textContent = "Esta herramienta no está disponible para reserva en este momento."
    }
  }

  // Configurar fecha mínima (hoy)
  const today = new Date()
  const todayFormatted = today.toISOString().split("T")[0]

  if (startDateInput) {
    startDateInput.min = todayFormatted
    startDateInput.value = todayFormatted
  }

  if (endDateInput) {
    endDateInput.min = todayFormatted

    // Establecer fecha de fin por defecto (mañana)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    endDateInput.value = tomorrow.toISOString().split("T")[0]
  }

  // Mostrar precio por día
  if (dayPrice) dayPrice.textContent = formatPrice(tool.rentalCost || tool.price || 0)

  // Calcular días y total inicial
  calculateDaysAndTotal()

  // Actualizar cálculos cuando cambian las fechas
  if (startDateInput) {
    startDateInput.addEventListener("change", () => {
      // Asegurarse de que la fecha de fin sea posterior a la de inicio
      if (endDateInput && endDateInput.value < startDateInput.value) {
        endDateInput.value = startDateInput.value
      }

      calculateDaysAndTotal()
    })
  }

  if (endDateInput) {
    endDateInput.addEventListener("change", () => {
      // Asegurarse de que la fecha de fin sea posterior a la de inicio
      if (startDateInput && endDateInput.value < startDateInput.value) {
        startDateInput.value = endDateInput.value
      }

      calculateDaysAndTotal()
    })
  }

  // Manejar envío del formulario
  const makeReservationForm = document.getElementById("make-reservation-form")
  if (makeReservationForm) {
    makeReservationForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      if (reservationError) reservationError.textContent = ""

      try {
        // Deshabilitar botón mientras se procesa
        if (reserveButton) {
          reserveButton.disabled = true
          reserveButton.textContent = "Procesando..."
        }

        // Crear objeto de reserva
        const reservationData = {
          toolId: toolId,
          startDate: startDateInput.value,
          endDate: endDateInput.value,
          userId: user.id,
        }

        // Enviar reserva
        const response = await fetch(`${API_URL}/reservations`, {
          method: "POST",
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reservationData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al crear la reserva")
        }

        const reservation = await response.json()

        // Redireccionar a página de confirmación o dashboard
        window.location.href = `reservation-confirmation.html?id=${reservation.id}`
      } catch (error) {
        console.error("Error al crear reserva:", error)

        if (reservationError) {
          reservationError.textContent =
            error.message || "Error al crear la reserva. Por favor, intenta de nuevo más tarde."
        }

        // Habilitar botón nuevamente
        if (reserveButton) {
          reserveButton.disabled = false
          reserveButton.textContent = "Reservar Ahora"
        }
      }
    })
  }

  // Función para calcular días y total
  function calculateDaysAndTotal() {
    if (!startDateInput || !endDateInput || !daysCount || !totalPrice) return

    const startDate = new Date(startDateInput.value)
    const endDate = new Date(endDateInput.value)

    // Calcular diferencia en días
    const diffTime = endDate.getTime() - startDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Mostrar días (mínimo 1)
    const days = Math.max(1, diffDays)
    daysCount.textContent = days

    // Calcular y mostrar total
    const price = tool.rentalCost || tool.price || 0
    const total = price * days
    totalPrice.textContent = formatPrice(total)
  }
}

// Función para cargar herramientas similares
async function loadSimilarTools(categoryId) {
  const similarToolsContainer = document.getElementById("similar-tools-container")
  if (!similarToolsContainer || !categoryId) return

  try {
    // Mostrar spinner de carga
    similarToolsContainer.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
    `

    // Realizar petición
    const response = await fetch(`${API_URL}/tools?category=${categoryId}&size=4`, {
      method: "GET",
      headers: myHeaders,
    })

    if (!response.ok) {
      throw new Error("Error al cargar herramientas similares")
    }

    const data = await response.json()
    const tools = data.content || data

    // Limpiar contenedor
    similarToolsContainer.innerHTML = ""

    // Filtrar la herramienta actual
    const filteredTools = tools.filter((tool) => tool.id !== toolId || tool.idTool !== toolId)

    // Mostrar mensaje si no hay herramientas similares
    if (filteredTools.length === 0) {
      similarToolsContainer.innerHTML = `
        <div class="no-results">
          <p>No hay herramientas similares disponibles.</p>
        </div>
      `
      return
    }

    // Crear tarjetas de herramientas similares
    filteredTools.slice(0, 3).forEach((tool) => {
      const card = createToolCard(tool)
      similarToolsContainer.appendChild(card)
    })
  } catch (error) {
    console.error("Error al cargar herramientas similares:", error)
    similarToolsContainer.innerHTML = `
      <div class="error-message">
        <p>Error al cargar herramientas similares. Por favor, intenta de nuevo más tarde.</p>
      </div>
    `
  }
}

// Función para crear una tarjeta de herramienta
function createToolCard(tool) {
  const card = document.createElement("div")
  card.className = "tool-card"

  const imageUrl = tool.imageUrl || "/images/herramientas.png"
  const statusClass =
    tool.status === "AVAILABLE" || tool.status === "DISPONIBLE"
      ? "available"
      : tool.status === "RENTED" || tool.status === "ALQUILADO"
        ? "rented"
        : "maintenance"

  const statusText =
    tool.status === "AVAILABLE" || tool.status === "DISPONIBLE"
      ? "Disponible"
      : tool.status === "RENTED" || tool.status === "ALQUILADO"
        ? "Alquilado"
        : "En Mantenimiento"

  card.innerHTML = `
    <div class="tool-image">
      <img src="${imageUrl}" alt="${tool.name}">
      <div class="tool-status status-${statusClass}">${statusText}</div>
    </div>
    <div class="tool-content">
      <div class="tool-category">${tool.category?.name || "Sin categoría"}</div>
      <h3 class="tool-title">${tool.name}</h3>
      <div class="tool-rating">
        <div class="stars"></div>
        <span class="rating-count">(${tool.reviews || 0} reseñas)</span>
      </div>
      <div class="tool-footer">
        <div class="tool-price">${formatPrice(tool.rentalCost || tool.price || 0)}<span>/día</span></div>
        <a href="tool-details.html?id=${tool.id || tool.idTool}" class="btn btn-outline btn-sm">Ver detalles</a>
      </div>
    </div>
  `

  // Agregar estrellas
  const starsContainer = card.querySelector(".stars")
  const stars = createStars(tool.rating || 4.5)
  starsContainer.appendChild(stars)

  return card
}

// Inicializar página
document.addEventListener("DOMContentLoaded", () => {
  loadToolDetails()

  // Verificar si el usuario está autenticado
  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null

  const authButtonsContainer = document.getElementById("auth-buttons-container")
  const userMenuContainer = document.getElementById("user-menu-container")

  if (token && user) {
    // Usuario autenticado
    if (authButtonsContainer) authButtonsContainer.style.display = "none"
    if (userMenuContainer) {
      userMenuContainer.style.display = "block"
      const userNameElement = userMenuContainer.querySelector(".user-name")
      const userAvatarElement = userMenuContainer.querySelector(".user-avatar")

      if (userNameElement) userNameElement.textContent = user.name || "Usuario"
      if (userAvatarElement) userAvatarElement.src = user.avatar || "img/user-avatar.png"
    }
  } else {
    // Usuario no autenticado
    if (authButtonsContainer) authButtonsContainer.style.display = "flex"
    if (userMenuContainer) userMenuContainer.style.display = "none"
  }

  // Manejar cierre de sesión
  const logoutButton = document.getElementById("logout-button")
  if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault()
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "index.html"
    })
  }
})
