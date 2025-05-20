// Importar las variables y funciones necesarias
import { API_URL, myHeaders } from "../enviroment.js"
import Auth from "../auth.js"
import { formatPrice, createStars } from "../main.js"

// Variables globales
let currentPage = 1
const pageSize = 8
let totalPages = 1
let currentFilters = {
  category: "",
  maxPrice: 500,
  availability: "AVAILABLE",
  rating: "",
  sort: "name,asc",
}

// Función para cargar categorías
async function loadCategories() {
  const categoryFilter = document.getElementById("category-filter")
  if (!categoryFilter) return

  try {
    // Realizar petición para obtener categorías
    const response = await fetch(`${API_URL}/categories`, {
      method: "GET",
      headers: myHeaders,
    })

    if (!response.ok) {
      throw new Error("Error al cargar categorías")
    }

    const categories = await response.json()

    // Agregar opciones al select
    categories.forEach((category) => {
      const option = document.createElement("option")
      option.value = category.id
      option.textContent = category.name
      categoryFilter.appendChild(option)
    })
  } catch (error) {
    console.error("Error al cargar categorías:", error)
  }
}

// Función para cargar herramientas
async function loadTools() {
  const toolsGrid = document.getElementById("tools-grid")
  const toolsLoader = document.getElementById("tools-loader")
  const resultsCount = document.getElementById("results-count")
  const pageInfo = document.getElementById("page-info")
  const prevPageBtn = document.getElementById("prev-page")
  const nextPageBtn = document.getElementById("next-page")

  if (!toolsGrid) return

  try {
    // Mostrar loader
    if (toolsLoader) toolsLoader.style.display = "block"
    if (toolsGrid) toolsGrid.innerHTML = ""

    // Construir URL con filtros
    let url = `${API_URL}/tools?page=${currentPage - 1}&size=${pageSize}`

    if (currentFilters.category) {
      url += `&category=${currentFilters.category}`
    }

    if (currentFilters.availability) {
      url += `&status=${currentFilters.availability}`
    }

    if (currentFilters.maxPrice) {
      url += `&maxPrice=${currentFilters.maxPrice}`
    }

    if (currentFilters.rating) {
      url += `&minRating=${currentFilters.rating}`
    }

    if (currentFilters.sort) {
      url += `&sort=${currentFilters.sort}`
    }

    // Realizar petición
    const response = await fetch(url, {
      method: "GET",
      headers: myHeaders,
    })

    if (!response.ok) {
      throw new Error("Error al cargar herramientas")
    }

    const data = await response.json()
    const tools = data.content || data
    totalPages = data.totalPages || 1
    const totalElements = data.totalElements || tools.length

    // Ocultar loader
    if (toolsLoader) toolsLoader.style.display = "none"

    // Actualizar contador de resultados
    if (resultsCount) {
      resultsCount.textContent = `Mostrando ${tools.length} de ${totalElements} herramientas`
    }

    // Actualizar información de página
    if (pageInfo) {
      pageInfo.textContent = `Página ${currentPage} de ${totalPages}`
    }

    // Actualizar botones de paginación
    if (prevPageBtn) {
      prevPageBtn.disabled = currentPage === 1
    }

    if (nextPageBtn) {
      nextPageBtn.disabled = currentPage === totalPages
    }

    // Mostrar mensaje si no hay herramientas
    if (tools.length === 0) {
      toolsGrid.innerHTML = `
        <div class="no-results">
          <p>No se encontraron herramientas con los filtros seleccionados.</p>
        </div>
      `
      return
    }

    // Crear tarjetas de herramientas
    tools.forEach((tool) => {
      const toolCard = document.createElement("div")
      toolCard.className = "tool-card"

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

      toolCard.innerHTML = `
        <div class="tool-image">
          <img src="${imageUrl}" alt="${tool.name}">
          <div class="status-badge status-${statusClass}">${statusText}</div>
        </div>
        <div class="tool-content">
          <div class="tool-category">${tool.category?.name || "Sin categoría"}</div>
          <h3 class="tool-title">${tool.name}</h3>
          <div class="tool-rating">
            <div class="stars"></div>
            <span class="rating-count">(${tool.reviews || 0} reseñas)</span>
          </div>
          <div class="tool-price">${formatPrice(tool.rentalCost || tool.price || 0)}<span>/día</span></div>
          <button class="btn btn-primary btn-block view-tool-details" data-id="${tool.id || tool.idTool}">Ver Detalles</button>
        </div>
      `

      // Agregar estrellas
      const starsContainer = toolCard.querySelector(".stars")
      const stars = createStars(tool.rating || 4.5)
      starsContainer.appendChild(stars)

      // Agregar evento para ver detalles
      const viewDetailsBtn = toolCard.querySelector(".view-tool-details")
      if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener("click", () => {
          showToolDetails(tool)
        })
      }

      toolsGrid.appendChild(toolCard)
    })
  } catch (error) {
    console.error("Error al cargar herramientas:", error)

    // Ocultar loader
    if (toolsLoader) toolsLoader.style.display = "none"

    // Mostrar mensaje de error
    if (toolsGrid) {
      toolsGrid.innerHTML = `
        <div class="error-message">
          <p>Error al cargar herramientas. Por favor, intenta de nuevo más tarde.</p>
        </div>
      `
    }
  }
}

// Función para mostrar detalles de una herramienta
async function showToolDetails(tool) {
  const modal = document.getElementById("tool-modal")
  if (!modal) return

  try {
    // Actualizar información básica
    document.getElementById("modal-tool-name").textContent = tool.name
    document.getElementById("modal-tool-image").src = tool.imageUrl || "/images/herramientas.png"
    document.getElementById("modal-tool-category").textContent = tool.category?.name || "Sin categoría"
    document.getElementById("modal-tool-price").textContent = formatPrice(tool.rentalCost || tool.price || 0)
    document.getElementById("modal-tool-description").textContent = tool.description || "No hay descripción disponible."

    // Actualizar estado
    const statusBadge = document.getElementById("modal-tool-status-badge")
    if (statusBadge) {
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

      statusBadge.textContent = statusText
      statusBadge.className = `status-badge status-${statusClass}`
    }

    // Actualizar calificación
    const ratingContainer = document.getElementById("modal-tool-rating")
    if (ratingContainer) {
      ratingContainer.innerHTML = ""
      const stars = createStars(tool.rating || 4.5)
      ratingContainer.appendChild(stars)
    }

    document.getElementById("modal-tool-rating-count").textContent = `(${tool.reviews || 0} reseñas)`

    // Actualizar información del proveedor
    if (tool.provider) {
      document.getElementById("modal-provider-name").textContent = tool.provider.name || "Proveedor"
      document.getElementById("modal-provider-avatar").src = tool.provider.avatar || "/images/proveedor.jpeg"

      // Actualizar calificación del proveedor
      const providerRatingContainer = document.getElementById("modal-provider-rating")
      if (providerRatingContainer) {
        providerRatingContainer.innerHTML = ""
        const stars = createStars(tool.provider.rating || 4.0)
        providerRatingContainer.appendChild(stars)
      }

      document.getElementById("modal-provider-rating-count").textContent = `(${tool.provider.reviews || 0} reseñas)`
    }

    // Actualizar especificaciones
    const specsContainer = document.getElementById("modal-tool-specs")
    if (specsContainer) {
      specsContainer.innerHTML = ""

      if (tool.specifications && tool.specifications.length > 0) {
        tool.specifications.forEach((spec) => {
          const li = document.createElement("li")
          li.textContent = spec
          specsContainer.appendChild(li)
        })
      } else {
        specsContainer.innerHTML = "<li>No hay especificaciones disponibles</li>"
      }
    }

    // Configurar formulario de reserva
    setupReservationForm(tool)

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
  } catch (error) {
    console.error("Error al mostrar detalles de la herramienta:", error)
  }
}

// Función para configurar el formulario de reserva
function setupReservationForm(tool) {
  const reservationForm = document.getElementById("reservation-form")
  if (!reservationForm) return

  // Verificar si la herramienta está disponible
  if (tool.status !== "AVAILABLE" && tool.status !== "DISPONIBLE") {
    reservationForm.innerHTML = `
      <h3>Hacer Reserva</h3>
      <div class="alert alert-warning">
        <p>Esta herramienta no está disponible para reserva en este momento.</p>
      </div>
    `
    return
  }

  // Configurar fecha mínima (hoy)
  const today = new Date()
  const todayFormatted = today.toISOString().split("T")[0]

  const startDateInput = document.getElementById("reservation-start")
  const endDateInput = document.getElementById("reservation-end")

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

  // Actualizar resumen de reserva
  updateReservationSummary(tool)

  // Actualizar resumen cuando cambian las fechas
  if (startDateInput) {
    startDateInput.addEventListener("change", () => {
      // Asegurarse de que la fecha de fin sea posterior a la de inicio
      if (endDateInput && endDateInput.value < startDateInput.value) {
        endDateInput.value = startDateInput.value
      }

      updateReservationSummary(tool)
    })
  }

  if (endDateInput) {
    endDateInput.addEventListener("change", () => {
      // Asegurarse de que la fecha de fin sea posterior a la de inicio
      if (startDateInput && endDateInput.value < startDateInput.value) {
        startDateInput.value = endDateInput.value
      }

      updateReservationSummary(tool)
    })
  }

  // Configurar botón de reserva
  const reserveBtn = document.getElementById("reserve-btn")
  if (reserveBtn) {
    reserveBtn.addEventListener("click", (e) => {
      e.preventDefault()
      makeReservation(tool)
    })
  }
}

// Función para actualizar el resumen de la reserva
function updateReservationSummary(tool) {
  const startDateInput = document.getElementById("reservation-start")
  const endDateInput = document.getElementById("reservation-end")
  const summaryPricePerDay = document.getElementById("summary-price-per-day")
  const summaryDays = document.getElementById("summary-days")
  const summarySubtotal = document.getElementById("summary-subtotal")
  const summaryTax = document.getElementById("summary-tax")
  const summaryTotal = document.getElementById("summary-total")

  if (!startDateInput || !endDateInput) return

  // Calcular días
  const startDate = new Date(startDateInput.value)
  const endDate = new Date(endDateInput.value)
  const diffTime = endDate.getTime() - startDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const days = Math.max(1, diffDays)

  // Calcular precios
  const pricePerDay = tool.rentalCost || tool.price || 0
  const subtotal = pricePerDay * days
  const tax = subtotal * 0.19
  const total = subtotal + tax

  // Actualizar resumen
  if (summaryPricePerDay) summaryPricePerDay.textContent = formatPrice(pricePerDay)
  if (summaryDays) summaryDays.textContent = days
  if (summarySubtotal) summarySubtotal.textContent = formatPrice(subtotal)
  if (summaryTax) summaryTax.textContent = formatPrice(tax)
  if (summaryTotal) summaryTotal.textContent = formatPrice(total)
}

// Función para hacer una reserva
async function makeReservation(tool) {
  try {
    // Verificar autenticación
    if (!Auth.isAuthenticated()) {
      alert("Debes iniciar sesión para hacer una reserva.")
      return
    }

    const user = Auth.getCurrentUser()
    const token = localStorage.getItem("token")
    const startDateInput = document.getElementById("reservation-start")
    const endDateInput = document.getElementById("reservation-end")
    const reserveBtn = document.getElementById("reserve-btn")

    if (!startDateInput || !endDateInput || !reserveBtn) return

    // Deshabilitar botón mientras se procesa
    reserveBtn.disabled = true
    reserveBtn.textContent = "Procesando..."

    // Crear objeto de reserva
    const reservationData = {
      toolId: tool.id || tool.idTool,
      userId: user.id,
      startDate: startDateInput.value,
      endDate: endDateInput.value,
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

    // Cerrar modal
    const modal = document.getElementById("tool-modal")
    if (modal) modal.classList.remove("active")

    // Mostrar mensaje de éxito
    alert("¡Reserva creada con éxito! Puedes ver los detalles en tu dashboard.")

    // Redirigir a la página de reservas
    window.location.href = "my-reservations.html"
  } catch (error) {
    console.error("Error al hacer reserva:", error)
    alert(error.message || "Error al hacer la reserva. Por favor, intenta de nuevo más tarde.")

    // Habilitar botón nuevamente
    const reserveBtn = document.getElementById("reserve-btn")
    if (reserveBtn) {
      reserveBtn.disabled = false
      reserveBtn.textContent = "Reservar Ahora"
    }
  }
}

// Función para inicializar filtros
function initFilters() {
  const categoryFilter = document.getElementById("category-filter")
  const priceFilter = document.getElementById("price-filter")
  const priceValue = document.getElementById("price-value")
  const availabilityFilter = document.getElementById("availability-filter")
  const ratingFilter = document.getElementById("rating-filter")
  const sortFilter = document.getElementById("sort-filter")
  const applyFiltersBtn = document.getElementById("apply-filters")
  const resetFiltersBtn = document.getElementById("reset-filters")
  const toggleFiltersBtn = document.getElementById("toggle-filters")
  const filtersBody = document.getElementById("filters-body")

  // Mostrar/ocultar filtros en móvil
  if (toggleFiltersBtn && filtersBody) {
    toggleFiltersBtn.addEventListener("click", () => {
      filtersBody.classList.toggle("active")
    })
  }

  // Actualizar valor del precio
  if (priceFilter && priceValue) {
    priceFilter.addEventListener("input", () => {
      priceValue.textContent = `$${priceFilter.value}`
      currentFilters.maxPrice = Number.parseInt(priceFilter.value)
    })
  }

  // Aplicar filtros
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", () => {
      // Actualizar filtros
      if (categoryFilter) currentFilters.category = categoryFilter.value
      if (availabilityFilter) currentFilters.availability = availabilityFilter.value
      if (ratingFilter) currentFilters.rating = ratingFilter.value
      if (sortFilter) currentFilters.sort = sortFilter.value

      // Resetear página
      currentPage = 1

      // Cargar herramientas con nuevos filtros
      loadTools()

      // Cerrar filtros en móvil
      if (filtersBody) filtersBody.classList.remove("active")
    })
  }

  // Resetear filtros
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", () => {
      // Resetear valores de los filtros
      if (categoryFilter) categoryFilter.value = ""
      if (priceFilter) {
        priceFilter.value = 500
        if (priceValue) priceValue.textContent = "$500"
      }
      if (availabilityFilter) availabilityFilter.value = "AVAILABLE"
      if (ratingFilter) ratingFilter.value = ""
      if (sortFilter) sortFilter.value = "name,asc"

      // Resetear filtros actuales
      currentFilters = {
        category: "",
        maxPrice: 500,
        availability: "AVAILABLE",
        rating: "",
        sort: "name,asc",
      }

      // Resetear página
      currentPage = 1

      // Cargar herramientas con filtros reseteados
      loadTools()
    })
  }
}

// Función para inicializar paginación
function initPagination() {
  const prevPageBtn = document.getElementById("prev-page")
  const nextPageBtn = document.getElementById("next-page")

  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--
        loadTools()
        window.scrollTo(0, 0)
      }
    })
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++
        loadTools()
        window.scrollTo(0, 0)
      }
    })
  }
}

// Función para inicializar búsqueda
function initSearch() {
  const headerSearch = document.getElementById("header-search")
  const headerSearchBtn = document.getElementById("header-search-btn")

  if (headerSearch && headerSearchBtn) {
    headerSearchBtn.addEventListener("click", () => {
      const searchTerm = headerSearch.value.trim()
      if (searchTerm) {
        // Implementar búsqueda
        // Esta funcionalidad dependerá de cómo esté implementada la API
        alert(`Búsqueda de "${searchTerm}" no implementada aún.`)
      }
    })

    headerSearch.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        headerSearchBtn.click()
      }
    })
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

  if (notificationBell && notificationDropdown) {
    notificationBell.addEventListener("click", () => {
      notificationDropdown.classList.toggle("active")
    })

    // Cerrar al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!notificationBell.contains(e.target)) {
        notificationDropdown.classList.remove("active")
      }
    })
  }
}

// Inicializar página
document.addEventListener("DOMContentLoaded", () => {
  // Proteger página
  Auth.protectPage(["CLIENT"])

  // Inicializar componentes
  initMobileMenu()
  initUserMenu()
  initNotifications()
  initFilters()
  initPagination()
  initSearch()

  // Cargar datos
  loadCategories()
  loadTools()
})
