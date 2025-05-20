// Importar funciones y configuraciones necesarias
import { API_URL, myHeaders } from "./enviroment.js"
import { createToolCard } from "./main.js"

// Función para cargar herramientas destacadas
async function loadFeaturedTools() {
  const container = document.getElementById("featured-tools-container")
  if (!container) return

  try {
    // Mostrar spinner de carga
    container.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
    `

    // Obtener herramientas desde la API
    const response = await fetch(`${API_URL}/tools/featured?size=3`, {
      method: "GET",
      headers: myHeaders,
    })

    if (!response.ok) {
      throw new Error("Error al cargar herramientas destacadas")
    }

    const data = await response.json()
    const tools = data.content || data

    // Limpiar contenedor
    container.innerHTML = ""

    // Mostrar mensaje si no hay herramientas
    if (tools.length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <p>No hay herramientas destacadas disponibles en este momento.</p>
        </div>
      `
      return
    }

    // Crear tarjetas de herramientas
    tools.forEach((tool) => {
      const card = createToolCard(tool)
      container.appendChild(card)
    })
  } catch (error) {
    console.error("Error al cargar herramientas destacadas:", error)
    container.innerHTML = `
      <div class="error-message">
        <p>Error al cargar herramientas destacadas. Por favor, intenta de nuevo más tarde.</p>
      </div>
    `
  }
}

// Función para inicializar el slider de testimonios
function initTestimonialsSlider() {
  const slider = document.querySelector(".testimonials-slider")
  if (!slider) return

  const testimonials = slider.querySelectorAll(".testimonial")
  const prevButton = document.querySelector(".prev-testimonial")
  const nextButton = document.querySelector(".next-testimonial")

  let currentIndex = 0

  // Función para mostrar testimonio actual
  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      testimonial.style.display = i === index ? "block" : "none"
    })
  }

  // Mostrar primer testimonio
  showTestimonial(currentIndex)

  // Evento para botón anterior
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length
      showTestimonial(currentIndex)
    })
  }

  // Evento para botón siguiente
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % testimonials.length
      showTestimonial(currentIndex)
    })
  }

  // Cambiar automáticamente cada 5 segundos
  setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonials.length
    showTestimonial(currentIndex)
  }, 5000)
}

// Función para inicializar el formulario de newsletter
function initNewsletterForm() {
  const form = document.getElementById("newsletter-form")
  if (!form) return

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = form.querySelector('input[type="email"]').value

    // Aquí se podría enviar el email a la API
    alert(`¡Gracias por suscribirte! Te enviaremos noticias a ${email}`)

    // Limpiar formulario
    form.reset()
  })
}

// Inicializar funciones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  loadFeaturedTools()
  initTestimonialsSlider()
  initNewsletterForm()

  // Verificar si el usuario está autenticado
  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null

  const authButtons = document.querySelector(".auth-buttons")

  if (token && user) {
    // Usuario autenticado - modificar los botones de autenticación
    if (authButtons) {
      authButtons.innerHTML = `
        <a href="Pages/${user.role.toLowerCase()}/dashboard.html" class="btn btn-outline">Mi Dashboard</a>
        <button id="logout-btn" class="btn btn-primary">Cerrar Sesión</button>
      `

      // Agregar evento de cierre de sesión
      const logoutBtn = document.getElementById("logout-btn")
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          localStorage.removeItem("refreshToken")
          localStorage.removeItem("tokenExpiration")
          window.location.reload()
        })
      }
    }
  }
})
