import { createAdminViews } from "./roles/admin.js"
import { createProviderViews } from "./roles/provider.js"
import { createClientViews } from "./roles/client.js"

const DEFAULT_USER_DATA = {
  name: "Usuario",
  initials: "US",
  notifications: 0,
}

const appState = {
  currentRole: "admin",
  user: DEFAULT_USER_DATA,
}

function initApp() {
  // Verificar autenticación
  if (!localStorage.getItem("isAuthenticated")) {
    window.location.href = "login.html"
    return
  }

  // Cargar datos del usuario
  loadUserData()

  // Obtener rol de la URL o localStorage
  const urlParams = new URLSearchParams(window.location.search)
  const roleParam = urlParams.get("role")
  const storedRole = localStorage.getItem("userRole")

  // Establecer rol actual
  appState.currentRole = roleParam || storedRole || "client"

  // Renderizar la aplicación
  renderApp()

  // Configurar eventos
  setupEvents()
}

// Función para cargar datos del usuario
function loadUserData() {
  const storedUserData = localStorage.getItem("userData")

  if (storedUserData) {
    try {
      const userData = JSON.parse(storedUserData)
      appState.user = {
        ...DEFAULT_USER_DATA,
        ...userData,
      }
    } catch (e) {
      console.error("Error al cargar datos del usuario:", e)
    }
  }
}

// Función para renderizar la aplicación
async function renderApp() {
  const mainContent = document.getElementById("mainContent")
  const navMenu = document.getElementById("navMenu")
  const roleSelector = document.getElementById("roleSelector")

  // Actualizar selector de rol
  roleSelector.value = appState.currentRole

  // Generar menú según el rol
  navMenu.innerHTML = generateNavMenu(appState.currentRole)

  // Mostrar cargando
  mainContent.innerHTML = `
    <div class="loading">
      <i class="fas fa-spinner"></i>
      <span>Cargando...</span>
    </div>
  `

  // Generar contenido según el rol
  let contentHTML = ""
  try {
    if (appState.currentRole === "admin") {
      contentHTML = await createAdminViews()
    } else if (appState.currentRole === "provider") {
      contentHTML = await createProviderViews()
    } else if (appState.currentRole === "client") {
      contentHTML = await createClientViews()
    }

    mainContent.innerHTML = contentHTML
  } catch (error) {
    console.error("Error al cargar las vistas:", error)
    mainContent.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Ha ocurrido un error al cargar el contenido. Por favor, intenta de nuevo.</p>
      </div>
    `
  }

  setupEvents()
}

// Función para generar el menú de navegación según el rol
function generateNavMenu(role) {
  let menuHTML = ""

  if (role === "admin") {
    menuHTML = `
      <div class="nav-section">
        <div class="nav-section-title">Principal</div>
        <div class="nav-item active" data-view="admin-dashboard">
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </div>
        <div class="nav-item" data-view="admin-users">
          <i class="fas fa-users"></i>
          <span>Usuarios</span>
        </div>
        <div class="nav-item" data-view="admin-reservations">
          <i class="fas fa-calendar-alt"></i>
          <span>Reservas</span>
        </div>
        <div class="nav-item" data-view="admin-reports">
          <i class="fas fa-chart-bar"></i>
          <span>Reportes</span>
        </div>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">Configuración</div>
        <div class="nav-item">
          <i class="fas fa-cog"></i>
          <span>Ajustes</span>
        </div>
        <div class="nav-item" id="logoutBtn">
          <i class="fas fa-sign-out-alt"></i>
          <span>Cerrar Sesión</span>
        </div>
      </div>
    `
  } else if (role === "provider") {
    menuHTML = `
      <div class="nav-section">
        <div class="nav-section-title">Principal</div>
        <div class="nav-item active" data-view="provider-dashboard">
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </div>
        <div class="nav-item" data-view="provider-tools">
          <i class="fas fa-tools"></i>
          <span>Mis Herramientas</span>
        </div>
        <div class="nav-item" data-view="provider-reservations">
          <i class="fas fa-calendar-alt"></i>
          <span>Reservas</span>
        </div>
        <div class="nav-item" data-view="provider-billing">
          <i class="fas fa-file-invoice-dollar"></i>
          <span>Facturación</span>
        </div>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">Configuración</div>
        <div class="nav-item">
          <i class="fas fa-user-cog"></i>
          <span>Mi Perfil</span>
        </div>
        <div class="nav-item" id="logoutBtn">
          <i class="fas fa-sign-out-alt"></i>
          <span>Cerrar Sesión</span>
        </div>
      </div>
    `
  } else if (role === "client") {
    menuHTML = `
      <div class="nav-section">
        <div class="nav-section-title">Principal</div>
        <div class="nav-item active" data-view="client-dashboard">
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </div>
        <div class="nav-item" data-view="client-explore">
          <i class="fas fa-search"></i>
          <span>Explorar</span>
        </div>
        <div class="nav-item" data-view="client-reservations">
          <i class="fas fa-calendar-alt"></i>
          <span>Mis Reservas</span>
        </div>
        <div class="nav-item" data-view="client-payments">
          <i class="fas fa-credit-card"></i>
          <span>Pagos</span>
        </div>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">Configuración</div>
        <div class="nav-item">
          <i class="fas fa-user-cog"></i>
          <span>Mi Perfil</span>
        </div>
        <div class="nav-item" id="logoutBtn">
          <i class="fas fa-sign-out-alt"></i>
          <span>Cerrar Sesión</span>
        </div>
      </div>
    `
  }

  return menuHTML
}

// Función para configurar eventos
function setupEvents() {
  // Eventos para los elementos de navegación
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.addEventListener("click", handleNavItemClick)
  })

  // Evento para el selector de rol
  const roleSelector = document.getElementById("roleSelector")
  if (roleSelector) {
    roleSelector.addEventListener("change", function () {
      appState.currentRole = this.value
      localStorage.setItem("userRole", this.value)
      renderApp()
    })
  }

  // Evento para notificaciones
  const notificationsToggle = document.getElementById("notificationsToggle")
  const notificationsPanel = document.getElementById("notificationsPanel")

  if (notificationsToggle && notificationsPanel) {
    notificationsToggle.addEventListener("click", (e) => {
      e.stopPropagation()
      notificationsPanel.classList.toggle("show")
    })

    // Cerrar panel al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (
        notificationsPanel.classList.contains("show") &&
        !notificationsPanel.contains(e.target) &&
        e.target !== notificationsToggle
      ) {
        notificationsPanel.classList.remove("show")
      }
    })
  }

  // Evento para toggle del sidebar en móvil
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebar = document.getElementById("sidebar")

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show")
    })
  }

  // Evento para cerrar sesión
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("userData")
      window.location.href = "login.html"
    })
  }

  // Configurar eventos de modales
  setupModalEvents()
}

// Función para manejar clic en items de navegación
function handleNavItemClick(e) {
  const navItem = e.currentTarget
  const viewName = navItem.getAttribute("data-view")

  if (!viewName) return

  // Remover clase activa de todos los items
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
  })

  // Agregar clase activa al item clickeado
  navItem.classList.add("active")

  // Ocultar todas las vistas
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.add("hidden")
  })

  // Mostrar la vista correspondiente
  const viewToShow = document.querySelector(`.${viewName}-view`)
  if (viewToShow) {
    viewToShow.classList.remove("hidden")
  }

  // Cerrar sidebar en móvil
  const sidebar = document.getElementById("sidebar")
  if (window.innerWidth < 992 && sidebar) {
    sidebar.classList.remove("show")
  }
}

// Función para configurar eventos de modales
function setupModalEvents() {
  // Modal de agregar herramienta
  const addToolModal = document.getElementById("addToolModal")
  const addToolBtn = document.getElementById("addToolBtn")
  const closeToolModal = document.getElementById("closeToolModal")
  const cancelToolBtn = document.getElementById("cancelToolBtn")
  const saveToolBtn = document.getElementById("saveToolBtn")

  if (addToolBtn && addToolModal) {
    addToolBtn.addEventListener("click", () => {
      addToolModal.classList.add("show")
    })
  }

  if (closeToolModal && addToolModal) {
    closeToolModal.addEventListener("click", () => {
      addToolModal.classList.remove("show")
    })
  }

  if (cancelToolBtn && addToolModal) {
    cancelToolBtn.addEventListener("click", () => {
      addToolModal.classList.remove("show")
    })
  }

  if (saveToolBtn && addToolModal) {
    saveToolBtn.addEventListener("click", () => {
      // Aquí iría la lógica para guardar la herramienta
      // Por ahora solo cerramos el modal
      addToolModal.classList.remove("show")
    })
  }

  // Cerrar modal al hacer clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === addToolModal) {
      addToolModal.classList.remove("show")
    }
  })
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", initApp)
