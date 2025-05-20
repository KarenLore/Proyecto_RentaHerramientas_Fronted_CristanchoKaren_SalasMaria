// Función para inicializar el menú móvil
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenuToggle.classList.toggle("active")

      // Crear menú móvil si no existe
      let mobileMenu = document.querySelector(".mobile-menu")

      if (!mobileMenu) {
        mobileMenu = document.createElement("div")
        mobileMenu.className = "mobile-menu"

        // Clonar elementos de navegación
        const mainNav = document.querySelector(".main-nav")
        if (mainNav) {
          const navClone = mainNav.cloneNode(true)
          mobileMenu.appendChild(navClone)
        }

        // Clonar botones de autenticación
        const authButtons = document.querySelector(".auth-buttons")
        if (authButtons) {
          const authButtonsClone = document.createElement("div")
          authButtonsClone.className = "mobile-auth-buttons"

          Array.from(authButtons.children).forEach((child) => {
            authButtonsClone.appendChild(child.cloneNode(true))
          })

          mobileMenu.appendChild(authButtonsClone)
        }

        document.body.appendChild(mobileMenu)
      }

      // Mostrar/ocultar menú móvil
      mobileMenu.classList.toggle("active")
    })
  }
}

// Función para formatear precio
function formatPrice(price) {
  return `$${Number.parseFloat(price).toFixed(2)}`
}

// Función para formatear fecha
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Función para crear estrellas de calificación
function createStars(rating) {
  const starsContainer = document.createElement("div")
  starsContainer.className = "stars"

  // Redondear rating a 0.5 más cercano
  const roundedRating = Math.round(rating * 2) / 2

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("i")

    if (i <= roundedRating) {
      star.className = "fas fa-star"
    } else if (i - 0.5 === roundedRating) {
      star.className = "fas fa-star-half-alt"
    } else {
      star.className = "far fa-star"
    }

    starsContainer.appendChild(star)
  }

  return starsContainer
}

// Función para crear una tarjeta de herramienta
function createToolCard(tool) {
  const card = document.createElement("div")
  card.className = "tool-card"

  const imageUrl = tool.imageUrl || "/images/tool-placeholder.jpg"

  card.innerHTML = `
        <div class="tool-image">
            <img src="${imageUrl}" alt="${tool.name}">
            <div class="tool-status status-${tool.status.toLowerCase()}">${getStatusText(tool.status)}</div>
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

// Función para obtener texto de estado
function getStatusText(status) {
  switch (status) {
    case "AVAILABLE":
    case "DISPONIBLE":
      return "Disponible"
    case "RENTED":
    case "ALQUILADO":
      return "Alquilado"
    case "UNDER_MAINTENANCE":
      return "En Mantenimiento"
    default:
      return status
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

// Inicializar funciones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu()
})

// Exportar funciones para uso en otros archivos
export { formatPrice, formatDate, createStars, createToolCard, getStatusText, createPagination }
