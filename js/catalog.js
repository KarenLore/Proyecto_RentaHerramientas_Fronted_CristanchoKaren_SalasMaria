// Importar las variables y funciones necesarias
import { API_URL, myHeaders } from "./enviroment.js"
import { formatPrice, createStars } from "./main.js"

// Variables globales
let currentPage = 1
const pageSize = 12
let totalPages = 1
let currentFilters = {
  category: "",
  minPrice: 0,
  maxPrice: 100,
  availableOnly: true,
  sort: "name-asc",
}

// Función para cargar categorías
async function loadCategories() {
  const categoryContainer = document.getElementById("category-filters")
  if (!categoryContainer) return

  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: "GET",
      headers: myHeaders,
    })

    if (!response.ok) {
      throw new Error("Error al cargar categorías")
    }

    const categories = await response.json()

    // Limpiar contenedor
    categoryContainer.innerHTML = ""

    // Agregar opción "Todas las categorías"
    const allCategoriesOption = document.createElement("div")
    allCategoriesOption.className = "filter-option"
    allCategoriesOption.innerHTML = `
      <input type="radio" name="category" id="category-all" value="" checked>
      <label for="category-all">Todas las categorías</label>
    `
    categoryContainer.appendChild(allCategoriesOption)

    // Agregar categorías
    categories.forEach((category) => {
      const categoryOption = document.createElement("div")
      categoryOption.className = "filter-option"
      categoryOption.innerHTML = `
        <input type="radio" name="category" id="category-${category.id}" value="${category.id}">
        <label for="category-${category.id}">${category.name}</label>
      `
      categoryContainer.appendChild(categoryOption)
    })
  } catch (error) {
    console.error("Error al cargar categorías:", error)
    categoryContainer.innerHTML = `
      <div class="error-message">
        <p>Error al cargar categorías. Por favor, intenta de nuevo más tarde.</p>
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

// Función para cargar herramientas
async function loadTools() {
  const toolsContainer = document.getElementById("tools-container")
  const resultsCount = document.getElementById("results-count")
  if (!toolsContainer) return

  try {
    // Mostrar spinner de carga
    toolsContainer.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
    `

    // Construir URL con filtros
    let url = `${API_URL}/tools?page=${currentPage - 1}&size=${pageSize}`

    if (currentFilters.category) {
      url += `&category=${currentFilters.category}`
    }

    if (currentFilters.availableOnly) {
      url += "&status=AVAILABLE"
    }

    if (currentFilters.sort) {
      const [field, direction] = currentFilters.sort.split("-")
      url += `&sort=${field},${direction}`
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

    // Limpiar contenedor
    toolsContainer.innerHTML = ""

    // Actualizar contador de resultados
    if (resultsCount) {
      resultsCount.textContent = data.totalElements || tools.length
    }

    // Mostrar mensaje si no hay herramientas
    if (tools.length === 0) {
      toolsContainer.innerHTML = `
        <div class="no-results">
          <p>No se encontraron herramientas con los filtros seleccionados.</p>
        </div>
      `
      return
    }

    // Crear tarjetas de herramientas
    tools.forEach((tool) => {
      const card = createToolCard(tool)
      toolsContainer.appendChild(card)
    })

    // Crear paginación
    createPagination(currentPage, totalPages, "pagination-container", (page) => {
      currentPage = page
      loadTools()
      window.scrollTo(0, 0)
    })
  } catch (error) {
    console.error("Error al cargar herramientas:", error)
    toolsContainer.innerHTML = `
      <div class="error-message">
        <p>Error al cargar herramientas. Por favor, intenta de nuevo más tarde.</p>
      </div>
    `
  }
}

// Función para crear paginación
function createPagination(currentPage, totalPages, containerId, onPageChange) {
  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = ""

  // Botón anterior
  const prevButton = document.createElement("button")
  prevButton.className = `pagination-item ${currentPage === 1 ? "disabled" : ""}`
  prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>'
  prevButton.disabled = currentPage === 1
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  })
  container.appendChild(prevButton)

  // Páginas
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button")
    pageButton.className = `pagination-item ${i === currentPage ? "active" : ""}`
    pageButton.textContent = i
    pageButton.addEventListener("click", () => {
      onPageChange(i)
    })
    container.appendChild(pageButton)
  }

  // Botón siguiente
  const nextButton = document.createElement("button")
  nextButton.className = `pagination-item ${currentPage === totalPages ? "disabled" : ""}`
  nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>'
  nextButton.disabled = currentPage === totalPages
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  })
  container.appendChild(nextButton)
}

// Función para inicializar los filtros
function initFilters() {
  const applyFiltersButton = document.getElementById("apply-filters")
  const resetFiltersButton = document.getElementById("reset-filters")
  const minPriceRange = document.getElementById("min-price-range")
  const maxPriceRange = document.getElementById("max-price-range")
  const minPriceInput = document.getElementById("min-price")
  const maxPriceInput = document.getElementById("max-price")
  const availableOnlyCheckbox = document.getElementById("available-only")
  const sortOptions = document.getElementById("sort-options")
  const viewOptions = document.querySelectorAll(".view-option")

  // Inicializar rangos de precio
  if (minPriceRange && maxPriceRange && minPriceInput && maxPriceInput) {
    // Sincronizar inputs de rango con inputs numéricos
    minPriceRange.addEventListener("input", () => {
      minPriceInput.value = minPriceRange.value
      if (Number.parseInt(minPriceRange.value) > Number.parseInt(maxPriceRange.value)) {
        maxPriceRange.value = minPriceRange.value
        maxPriceInput.value = minPriceRange.value
      }
    })

    maxPriceRange.addEventListener("input", () => {
      maxPriceInput.value = maxPriceRange.value
      if (Number.parseInt(maxPriceRange.value) < Number.parseInt(minPriceRange.value)) {
        minPriceRange.value = maxPriceRange.value
        minPriceInput.value = maxPriceRange.value
      }
    })

    minPriceInput.addEventListener("input", () => {
      minPriceRange.value = minPriceInput.value
      if (Number.parseInt(minPriceInput.value) > Number.parseInt(maxPriceInput.value)) {
        maxPriceInput.value = minPriceInput.value
        maxPriceRange.value = minPriceInput.value
      }
    })

    maxPriceInput.addEventListener("input", () => {
      maxPriceRange.value = maxPriceInput.value
      if (Number.parseInt(maxPriceInput.value) < Number.parseInt(minPriceInput.value)) {
        minPriceInput.value = maxPriceInput.value
        minPriceRange.value = maxPriceInput.value
      }
    })
  }

  // Aplicar filtros
  if (applyFiltersButton) {
    applyFiltersButton.addEventListener("click", () => {
      // Obtener categoría seleccionada
      const selectedCategory = document.querySelector('input[name="category"]:checked')
      currentFilters.category = selectedCategory ? selectedCategory.value : ""

      // Obtener rango de precios
      currentFilters.minPrice = Number.parseInt(minPriceInput.value)
      currentFilters.maxPrice = Number.parseInt(maxPriceInput.value)

      // Obtener disponibilidad
      currentFilters.availableOnly = availableOnlyCheckbox.checked

      // Obtener orden
      currentFilters.sort = sortOptions.value

      // Resetear página actual
      currentPage = 1

      // Cargar herramientas con nuevos filtros
      loadTools()
    })
  }

  // Resetear filtros
  if (resetFiltersButton) {
    resetFiltersButton.addEventListener("click", () => {
      // Resetear categoría
      const allCategoriesOption = document.getElementById("category-all")
      if (allCategoriesOption) {
        allCategoriesOption.checked = true
      }

      // Resetear rango de precios
      minPriceRange.value = 0
      maxPriceRange.value = 100
      minPriceInput.value = 0
      maxPriceInput.value = 100

      // Resetear disponibilidad
      availableOnlyCheckbox.checked = true

      // Resetear orden
      sortOptions.value = "name-asc"

      // Resetear filtros actuales
      currentFilters = {
        category: "",
        minPrice: 0,
        maxPrice: 100,
        availableOnly: true,
        sort: "name-asc",
      }

      // Resetear página actual
      currentPage = 1

      // Cargar herramientas con filtros reseteados
      loadTools()
    })
  }

  // Cambiar vista (grid/list)
  if (viewOptions.length > 0) {
    viewOptions.forEach((option) => {
      option.addEventListener("click", () => {
        // Remover clase active de todas las opciones
        viewOptions.forEach((opt) => opt.classList.remove("active"))

        // Agregar clase active a la opción seleccionada
        option.classList.add("active")

        // Cambiar clase del contenedor de herramientas
        const toolsContainer = document.getElementById("tools-container")
        if (toolsContainer) {
          if (option.dataset.view === "grid") {
            toolsContainer.className = "tools-grid"
          } else {
            toolsContainer.className = "tools-list"
          }
        }
      })
    })
  }

  // Inicializar búsqueda
  const searchButton = document.getElementById("search-button")
  const searchInput = document.getElementById("search-input")

  if (searchButton && searchInput) {
    searchButton.addEventListener("click", () => {
      const searchTerm = searchInput.value.trim()
      if (searchTerm) {
        // Implementar búsqueda
        // Esta funcionalidad dependerá de cómo esté implementada la API
      }
    })

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchButton.click()
      }
    })
  }
}

// Inicializar página
document.addEventListener("DOMContentLoaded", () => {
  loadCategories()
  loadTools()
  initFilters()

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

// Exportar funciones para uso en otros archivos
export { createToolCard, loadTools }
