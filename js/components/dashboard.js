import { apiService } from "../services/apiService.js"
import { createAdminViews } from "../roles/admin.js"
import { createProviderViews } from "../roles/supplier.js"
import { createClientViews } from "../roles/client.js"

// App state
const appState = {
  currentRole: "",
  currentView: "dashboard",
  user: {
    name: "",
    email: "",
    initials: "",
    role: "",
  },
  sidebarCollapsed: false,
  notifications: [],
}

// Initialize the application
async function initApp() {
  console.log("🚀 Inicializando aplicación...")

  // Check authentication
  if (!localStorage.getItem("isAuthenticated")) {
    console.log("❌ No autenticado, redirigiendo a login")
    window.location.href = "login.html"
    return
  }

  try {
    // Load user data
    await loadUserData()
    console.log("✅ Datos de usuario cargados:", appState.user)

    // Setup UI
    setupUI()
    console.log("✅ UI configurada")

    // Render content based on role
    await renderContent()
    console.log("✅ Contenido renderizado")

    // Setup event listeners
    setupEventListeners()
    console.log("✅ Event listeners configurados")
  } catch (error) {
    console.error("❌ Error inicializando app:", error)
    showError("Error al cargar la aplicación. Por favor, recarga la página.")
  }
}

// Load user data from localStorage and API
async function loadUserData() {
  const userEmail = localStorage.getItem("userEmail")
  const userRole = localStorage.getItem("userRole")

  console.log("📧 Email del usuario:", userEmail)
  console.log("👤 Rol del usuario:", userRole)

  if (!userEmail || !userRole) {
    console.log("❌ Faltan datos de usuario, cerrando sesión")
    logout()
    return
  }

  appState.currentRole = userRole.toUpperCase()

  // Fallback user data
  appState.user = {
    name: userEmail.split("@")[0] || "Usuario",
    email: userEmail,
    initials: getInitials(userEmail.split("@")[0] || "Usuario"),
    role: userRole.toLowerCase(),
  }

  console.log("✅ Estado del usuario actualizado:", appState.user)
}

// Setup UI elements
function setupUI() {
  console.log("🎨 Configurando UI...")

  // Update user info
  const userNameEl = document.getElementById("userName")
  const userRoleEl = document.getElementById("userRole")
  const userInitialsEl = document.getElementById("userInitials")
  const headerUserNameEl = document.getElementById("headerUserName")
  const headerUserInitialsEl = document.getElementById("headerUserInitials")

  if (userNameEl) userNameEl.textContent = appState.user.name
  if (userRoleEl) userRoleEl.textContent = getRoleDisplayName(appState.user.role)
  if (userInitialsEl) userInitialsEl.textContent = appState.user.initials
  if (headerUserNameEl) headerUserNameEl.textContent = appState.user.name
  if (headerUserInitialsEl) headerUserInitialsEl.textContent = appState.user.initials

  // Setup navigation menu based on role
  setupNavMenu()
}

// Get display name for role
function getRoleDisplayName(role) {
  const roleNames = {
    admin: "Administrador",
    supplier: "Proveedor",
    client: "Cliente",
  }
  return roleNames[role.toLowerCase()] || role
}

// Setup navigation menu based on user role
function setupNavMenu() {
  console.log("📋 Configurando menú para rol:", appState.currentRole)

  const navMenu = document.getElementById("navMenu")
  if (!navMenu) {
    console.error("❌ No se encontró el elemento navMenu")
    return
  }

  let menuItems = []

  // Role-specific menu items
  if (appState.currentRole === "ADMIN") {
    menuItems = [
      { id: "dashboard", icon: "fas fa-tachometer-alt", text: "Dashboard" },
      { id: "users", icon: "fas fa-users", text: "Usuarios" },
      { id: "tools", icon: "fas fa-tools", text: "Herramientas" },
      { id: "reservations", icon: "fas fa-clipboard-list", text: "Reservas" },
      { id: "reports", icon: "fas fa-chart-bar", text: "Reportes" },
    ]
  } else if (appState.currentRole === "SUPPLIER") {
    menuItems = [
      { id: "dashboard", icon: "fas fa-tachometer-alt", text: "Dashboard" },
      { id: "tools", icon: "fas fa-tools", text: "Mis Herramientas" },
      { id: "reservations", icon: "fas fa-clipboard-list", text: "Reservas" },
      { id: "billing", icon: "fas fa-file-invoice-dollar", text: "Facturación" },
    ]
  } else if (appState.currentRole === "CLIENT") {
    menuItems = [
      { id: "dashboard", icon: "fas fa-tachometer-alt", text: "Dashboard" },
      { id: "explore", icon: "fas fa-search", text: "Explorar" },
      { id: "reservations", icon: "fas fa-clipboard-list", text: "Mis Reservas" },
      { id: "payments", icon: "fas fa-credit-card", text: "Pagos" },
    ]
  }

  // Generate menu HTML
  navMenu.innerHTML = menuItems
    .map(
      (item, index) => `
    <li>
      <a href="#" class="nav-item ${index === 0 ? "active" : ""}" data-view="${item.id}">
        <i class="${item.icon}"></i>
        <span class="nav-item-text">${item.text}</span>
      </a>
    </li>
  `,
    )
    .join("")

  console.log("✅ Menú configurado con", menuItems.length, "elementos")
}

// Render content based on user role
async function renderContent() {
  console.log("🎨 Renderizando contenido para rol:", appState.currentRole)

  const contentArea = document.getElementById("contentArea")
  const pageTitle = document.getElementById("pageTitle")

  if (!contentArea) {
    console.error("❌ No se encontró el elemento contentArea")
    return
  }

  // Show loading state
  contentArea.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Cargando contenido...</p>
    </div>
  `

  try {
    let content = ""

    // Generate content based on role
    if (appState.currentRole === "ADMIN") {
      console.log("📊 Cargando vistas de administrador...")
      content = await createAdminViews()
      if (pageTitle) pageTitle.textContent = "Panel de Administrador"
    } else if (appState.currentRole === "SUPPLIER") {
      console.log("🏪 Cargando vistas de proveedor...")
      content = await createProviderViews()
      if (pageTitle) pageTitle.textContent = "Panel de Proveedor"
    } else if (appState.currentRole === "CLIENT") {
      console.log("👤 Cargando vistas de cliente...")
      content = await createClientViews()
      if (pageTitle) pageTitle.textContent = "Panel de Cliente"
    }

    if (!content) {
      throw new Error("No se pudo generar el contenido para el rol: " + appState.currentRole)
    }

    // Update content
    contentArea.innerHTML = content
    console.log("✅ Contenido renderizado exitosamente")

    // Setup view-specific event listeners
    setupViewEventListeners()

    // Show first view by default
    showDefaultView()
  } catch (error) {
    console.error("❌ Error renderizando contenido:", error)
    contentArea.innerHTML = `
      <div class="error-message" style="text-align: center; padding: 2rem;">
        <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
        <h3>Error al cargar el contenido</h3>
        <p>Detalles: ${error.message}</p>
        <button class="btn btn-primary" onclick="window.location.reload()">
          <i class="fas fa-refresh"></i> Recargar página
        </button>
      </div>
    `
  }
}

// Show the default view (dashboard)
function showDefaultView() {
  console.log("👁️ Mostrando vista por defecto...")

  // Hide all views
  const views = document.querySelectorAll(".view")
  views.forEach((view) => {
    view.classList.add("hidden")
  })

  // Show dashboard view
  const dashboardView = document.querySelector(".dashboard-view")
  if (dashboardView) {
    dashboardView.classList.remove("hidden")
    console.log("✅ Vista dashboard mostrada")
  } else {
    console.error("❌ No se encontró la vista dashboard")
  }
}

// Setup event listeners
function setupEventListeners() {
  console.log("🎧 Configurando event listeners...")

  // Sidebar toggle
  const sidebarToggle = document.getElementById("sidebarToggle")
  const mobileSidebarToggle = document.getElementById("mobileSidebarToggle")
  const sidebar = document.querySelector(".sidebar")

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar)
  }

  if (mobileSidebarToggle) {
    mobileSidebarToggle.addEventListener("click", () => {
      sidebar?.classList.toggle("show")
    })
  }

  // Navigation menu - Use event delegation
  const navMenu = document.getElementById("navMenu")
  if (navMenu) {
    navMenu.addEventListener("click", handleNavigation)
  }

  // Notifications toggle
  const notificationsToggle = document.getElementById("notificationsToggle")
  const notificationsPanel = document.getElementById("notificationsPanel")

  if (notificationsToggle && notificationsPanel) {
    notificationsToggle.addEventListener("click", (e) => {
      e.stopPropagation()
      notificationsPanel.classList.toggle("show")
    })

    // Close notifications panel when clicking outside
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

  // User dropdown
  const userDropdownToggle = document.getElementById("userDropdownToggle")
  const userDropdownMenu = document.getElementById("userDropdownMenu")

  if (userDropdownToggle && userDropdownMenu) {
    userDropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation()
      userDropdownMenu.classList.toggle("show")
    })

    // Close user dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (
        userDropdownMenu.classList.contains("show") &&
        !userDropdownMenu.contains(e.target) &&
        e.target !== userDropdownToggle
      ) {
        userDropdownMenu.classList.remove("show")
      }
    })
  }

  // Logout buttons
  const logoutBtn = document.getElementById("logoutBtn")
  const headerLogoutBtn = document.getElementById("headerLogoutBtn")

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout)
  }

  if (headerLogoutBtn) {
    headerLogoutBtn.addEventListener("click", logout)
  }

  console.log("✅ Event listeners configurados")
}

// Setup view-specific event listeners
function setupViewEventListeners() {
  console.log("🎯 Configurando event listeners específicos de vistas...")

  // Add tool buttons
  const addToolBtns = document.querySelectorAll("[id*='addToolBtn'], .add-tool-btn")
  const addToolModal = document.getElementById("addToolModal")

  if (addToolBtns.length > 0 && addToolModal) {
    addToolBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        console.log("🔧 Abriendo modal de agregar herramienta")
        addToolModal.classList.add("show")
      })
    })
  }

  // Modal event listeners
  setupModalEvents()
}

// Handle navigation item click
function handleNavigation(e) {
  // Find the nav-item element
  const navItem = e.target.closest(".nav-item")
  if (!navItem) return

  e.preventDefault()

  const viewName = navItem.dataset.view
  if (!viewName) return

  console.log("🧭 Navegando a vista:", viewName)

  // Update active nav item
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
  })
  navItem.classList.add("active")

  // Update page title
  const pageTitle = document.getElementById("pageTitle")
  const navText = navItem.querySelector(".nav-item-text")?.textContent
  if (pageTitle && navText) {
    pageTitle.textContent = navText
  }

  // Show the selected view
  const views = document.querySelectorAll(".view")
  views.forEach((view) => {
    view.classList.add("hidden")
  })

  // Try different view selector patterns
  const possibleSelectors = [
    `.${viewName}-view`,
    `.${appState.currentRole.toLowerCase()}-${viewName}-view`,
    `[data-view="${viewName}"]`,
  ]

  let selectedView = null
  for (const selector of possibleSelectors) {
    selectedView = document.querySelector(selector)
    if (selectedView) break
  }

  if (selectedView) {
    selectedView.classList.remove("hidden")
    console.log("✅ Vista mostrada:", viewName)
  } else {
    console.error("❌ No se encontró la vista:", viewName)
    console.log("🔍 Selectores intentados:", possibleSelectors)
  }

  // Close mobile sidebar if open
  const sidebar = document.querySelector(".sidebar")
  if (sidebar?.classList.contains("show")) {
    sidebar.classList.remove("show")
  }
}

// Setup modal events
function setupModalEvents() {
  const addToolModal = document.getElementById("addToolModal")
  const closeToolModal = document.getElementById("closeToolModal")
  const cancelToolBtn = document.getElementById("cancelToolBtn")
  const saveToolBtn = document.getElementById("saveToolBtn")

  if (addToolModal && closeToolModal && cancelToolBtn) {
    const closeModal = () => {
      addToolModal.classList.remove("show")
    }

    closeToolModal.addEventListener("click", closeModal)
    cancelToolBtn.addEventListener("click", closeModal)

    addToolModal.addEventListener("click", (e) => {
      if (e.target === addToolModal) {
        closeModal()
      }
    })

    if (saveToolBtn) {
      saveToolBtn.addEventListener("click", handleSaveTool)
    }
  }
}

// Handle save tool
async function handleSaveTool() {
  console.log("💾 Guardando herramienta...")

  const form = document.getElementById("addToolForm")
  if (!form) return

  const formData = new FormData(form)
  const toolData = {
    name: formData.get("name"),
    description: formData.get("description"),
    brand: formData.get("brand"),
    model: formData.get("model"),
    categoryId: formData.get("categoryId"),
    costPerDay: Number.parseFloat(formData.get("costPerDay")),
    availableQuantity: Number.parseInt(formData.get("availableQuantity")),
    imageUrl: formData.get("imageUrl") || null,
    active: true,
  }

  if (!toolData.name || !toolData.description || !toolData.brand || !toolData.model) {
    showError("Por favor completa todos los campos requeridos")
    return
  }

  try {
    const saveBtn = document.getElementById("saveToolBtn")
    saveBtn.disabled = true
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...'

    const savedTool = await apiService.createTool(toolData)
    console.log("✅ Herramienta guardada:", savedTool)

    document.getElementById("addToolModal").classList.remove("show")
    await renderContent()
    showSuccess("¡Herramienta agregada exitosamente!")
  } catch (error) {
    console.error("❌ Error guardando herramienta:", error)
    showError("Error al guardar la herramienta: " + error.message)
  } finally {
    const saveBtn = document.getElementById("saveToolBtn")
    saveBtn.disabled = false
    saveBtn.innerHTML = "Guardar Herramienta"
  }
}

// Toggle sidebar
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar")
  sidebar?.classList.toggle("collapsed")
  appState.sidebarCollapsed = !appState.sidebarCollapsed
}

// Logout function
function logout() {
  console.log("👋 Cerrando sesión...")
  localStorage.removeItem("authToken")
  localStorage.removeItem("userRole")
  localStorage.removeItem("isAuthenticated")
  localStorage.removeItem("userEmail")
  window.location.href = "login.html"
}

// Helper function to get initials from name
function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

// Show error message
function showError(message) {
  console.error("❌", message)
  // You can implement a toast notification here
  alert("Error: " + message)
}

// Show success message
function showSuccess(message) {
  console.log("✅", message)
  // You can implement a toast notification here
  alert("Éxito: " + message)
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp)
