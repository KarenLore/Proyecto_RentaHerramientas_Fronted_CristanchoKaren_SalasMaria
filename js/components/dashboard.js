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
  // Check authentication
  if (!localStorage.getItem("isAuthenticated")) {
    window.location.href = "login.html"
    return
  }

  // Load user data
  await loadUserData()

  // Setup UI
  setupUI()

  // Render content based on role
  await renderContent()

  // Setup event listeners
  setupEventListeners()
}

// Load user data from localStorage and API
async function loadUserData() {
  const userEmail = localStorage.getItem("userEmail")
  const userRole = localStorage.getItem("userRole")

  if (!userEmail || !userRole) {
    logout()
    return
  }

  appState.currentRole = userRole

  try {
    // Try to get user details from API
    const userData = await apiService.getUserByEmail(userEmail)

    if (userData) {
      appState.user = {
        name: userData.name || "User",
        email: userData.email,
        initials: getInitials(userData.name || "User"),
        role: userRole,
      }
    } else {
      // Fallback if API fails
      appState.user = {
        name: "User",
        email: userEmail,
        initials: "US",
        role: userRole,
      }
    }
  } catch (error) {
    console.error("Error loading user data:", error)
    // Fallback if API fails
    appState.user = {
      name: "User",
      email: userEmail,
      initials: "US",
      role: userRole,
    }
  }
}

// Setup UI elements
function setupUI() {
  // Update user info
  document.getElementById("userName").textContent = appState.user.name
  document.getElementById("userRole").textContent = appState.user.role
  document.getElementById("userInitials").textContent = appState.user.initials

  document.getElementById("headerUserName").textContent = appState.user.name
  document.getElementById("headerUserInitials").textContent = appState.user.initials

  // Setup navigation menu based on role
  setupNavMenu()
}

// Setup navigation menu based on user role
function setupNavMenu() {
  const navMenu = document.getElementById("navMenu")
  let menuItems = []

  // Common menu items
  const commonItems = [{ id: "dashboard", icon: "fas fa-tachometer-alt", text: "Dashboard" }]

  // Role-specific menu items
  if (appState.currentRole === "ADMIN") {
    menuItems = [
      ...commonItems,
      { id: "users", icon: "fas fa-users", text: "Users" },
      { id: "tools", icon: "fas fa-tools", text: "Tools" },
      { id: "rentals", icon: "fas fa-clipboard-list", text: "Rentals" },
      { id: "reports", icon: "fas fa-chart-bar", text: "Reports" },
    ]
  } else if (appState.currentRole === "SUPPLIER") {
    menuItems = [
      ...commonItems,
      { id: "tools", icon: "fas fa-tools", text: "My Tools" },
      { id: "rentals", icon: "fas fa-clipboard-list", text: "Rental Requests" },
      { id: "billing", icon: "fas fa-file-invoice-dollar", text: "Billing" },
    ]
  } else if (appState.currentRole === "CLIENT") {
    menuItems = [
      ...commonItems,
      { id: "explore", icon: "fas fa-search", text: "Explore Tools" },
      { id: "rentals", icon: "fas fa-clipboard-list", text: "My Rentals" },
      { id: "payments", icon: "fas fa-credit-card", text: "Payments" },
    ]
  }

  // Generate menu HTML
  navMenu.innerHTML = menuItems
    .map(
      (item) => `
    <li>
      <a href="#" class="nav-item ${item.id === "dashboard" ? "active" : ""}" data-view="${item.id}">
        <i class="${item.icon}"></i>
        <span class="nav-item-text">${item.text}</span>
      </a>
    </li>
  `,
    )
    .join("")
}

// Render content based on user role
async function renderContent() {
  const contentArea = document.getElementById("contentArea")
  const pageTitle = document.getElementById("pageTitle")

  // Show loading state
  contentArea.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading content...</p>
    </div>
  `

  try {
    let content = ""

    // Generate content based on role
    if (appState.currentRole === "ADMIN") {
      content = await createAdminViews()
      pageTitle.textContent = "Admin Dashboard"
    } else if (appState.currentRole === "SUPPLIER") {
      content = await createProviderViews()
      pageTitle.textContent = "Supplier Dashboard"
    } else if (appState.currentRole === "CLIENT") {
      content = await createClientViews()
      pageTitle.textContent = "Client Dashboard"
    }

    // Update content
    contentArea.innerHTML = content

    // Setup view-specific event listeners
    setupViewEventListeners()
  } catch (error) {
    console.error("Error rendering content:", error)
    contentArea.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>Error loading content. Please try again later.</p>
        <button class="btn btn-primary" onclick="window.location.reload()">Retry</button>
      </div>
    `
  }
}

// Setup event listeners
function setupEventListeners() {
  // Sidebar toggle
  const sidebarToggle = document.getElementById("sidebarToggle")
  const mobileSidebarToggle = document.getElementById("mobileSidebarToggle")
  const sidebar = document.querySelector(".sidebar")

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar)
  }

  if (mobileSidebarToggle) {
    mobileSidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show")
    })
  }

  // Navigation menu
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.addEventListener("click", handleNavigation)
  })

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

  // Add tool modal
  const addToolModal = document.getElementById("addToolModal")
  const closeToolModal = document.getElementById("closeToolModal")
  const cancelToolBtn = document.getElementById("cancelToolBtn")
  const saveToolBtn = document.getElementById("saveToolBtn")

  // Setup modal event listeners if elements exist
  if (addToolModal && closeToolModal && cancelToolBtn) {
    // Close modal functions
    const closeModal = () => {
      addToolModal.classList.remove("show")
    }

    closeToolModal.addEventListener("click", closeModal)
    cancelToolBtn.addEventListener("click", closeModal)

    // Close modal when clicking outside
    addToolModal.addEventListener("click", (e) => {
      if (e.target === addToolModal) {
        closeModal()
      }
    })

    // Save tool
    if (saveToolBtn) {
      saveToolBtn.addEventListener("click", handleSaveTool)
    }
  }
}

// Setup view-specific event listeners
function setupViewEventListeners() {
  // Add tool buttons
  const addToolBtns = document.querySelectorAll(".add-tool-btn")
  const addToolModal = document.getElementById("addToolModal")

  if (addToolBtns.length > 0 && addToolModal) {
    addToolBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        addToolModal.classList.add("show")
      })
    })
  }
}

// Handle navigation item click
function handleNavigation(e) {
  e.preventDefault()

  const viewName = e.currentTarget.dataset.view
  if (!viewName) return

  // Update active nav item
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
  })
  e.currentTarget.classList.add("active")

  // Update page title
  const pageTitle = document.getElementById("pageTitle")
  pageTitle.textContent = e.currentTarget.querySelector(".nav-item-text").textContent

  // Show the selected view
  const views = document.querySelectorAll(".view")
  views.forEach((view) => {
    view.classList.add("hidden")
  })

  const selectedView = document.querySelector(`.${viewName}-view`)
  if (selectedView) {
    selectedView.classList.remove("hidden")
  }

  // Close mobile sidebar if open
  const sidebar = document.querySelector(".sidebar")
  if (sidebar.classList.contains("show")) {
    sidebar.classList.remove("show")
  }
}

// Toggle sidebar
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar")
  sidebar.classList.toggle("collapsed")
  appState.sidebarCollapsed = !appState.sidebarCollapsed
}

// Handle save tool
async function handleSaveTool() {
  const form = document.getElementById("addToolForm")
  if (!form) return

  // Get form data
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

  // Validate data
  if (
    !toolData.name ||
    !toolData.description ||
    !toolData.brand ||
    !toolData.model ||
    !toolData.categoryId ||
    isNaN(toolData.costPerDay) ||
    isNaN(toolData.availableQuantity)
  ) {
    alert("Please fill in all required fields")
    return
  }

  try {
    // Show loading state
    const saveBtn = document.getElementById("saveToolBtn")
    saveBtn.disabled = true
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'

    // Save tool
    const savedTool = await apiService.createTool(toolData)

    // Close modal
    document.getElementById("addToolModal").classList.remove("show")

    // Refresh content
    await renderContent()

    // Show success message
    alert("Tool added successfully!")
  } catch (error) {
    console.error("Error saving tool:", error)
    alert("Error saving tool. Please try again.")
  } finally {
    // Reset button state
    const saveBtn = document.getElementById("saveToolBtn")
    saveBtn.disabled = false
    saveBtn.innerHTML = "Save Tool"
  }
}

// Logout function
function logout() {
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

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp)
