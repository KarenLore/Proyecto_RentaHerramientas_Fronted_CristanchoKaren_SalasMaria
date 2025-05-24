import { apiService } from "../services/apiService.js"
import { createStatCard } from "../components/cards.js"
import { createTable } from "../components/tables.js"

// === Vista del Dashboard ===
async function createAdminDashboardView() {
  try {
    const [users, tools, reservations] = await Promise.all([
      apiService.getUsers(),
      apiService.getTools(),
      apiService.getReservations(),
    ])

    const recentReservations = reservations
      .slice(0, 5)
      .map((reservation) => [
        reservation.id,
        reservation.client?.name || "Cliente no disponible",
        reservation.tool?.name || "Herramienta no disponible",
        reservation.startDate || "No especificada",
        reservation.endDate || "No especificada",
        `<span class="status status-${reservation.status?.toLowerCase() || "unknown"}">${reservation.status || "Desconocido"}</span>`,
        `$${Number.parseFloat(reservation.totalCost || 0).toFixed(2)}`,
        '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>',
      ])

    return `
      <div class="view admin-view admin-dashboard-view">
        <div class="dashboard-header">
          <div class="dashboard-title">Panel de Administrador</div>
          <div class="action-buttons">
            <button class="btn btn-secondary">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
            <button class="btn btn-primary">
              <i class="fas fa-plus"></i>
              <span>Nuevo Reporte</span>
            </button>
          </div>
        </div>
        <div class="stats-container">
          ${createStatCard("Usuarios Totales", users.length.toString(), "fas fa-users", "#6366f1", { type: "positive", icon: "fas fa-arrow-up", text: "12% desde el mes pasado" })}
          ${createStatCard("Herramientas Registradas", tools.length.toString(), "fas fa-tools", "#10b981", { type: "positive", icon: "fas fa-arrow-up", text: "8% desde el mes pasado" })}
          ${createStatCard("Reservas Activas", reservations.length.toString(), "fas fa-clipboard-list", "#f59e0b", { type: "positive", icon: "fas fa-arrow-up", text: "5% desde el mes pasado" })}
          ${createStatCard("Ingresos Totales", "$12,450", "fas fa-dollar-sign", "#ef4444", { type: "positive", icon: "fas fa-arrow-up", text: "15% desde el mes pasado" })}
        </div>
        ${createTable("Reservas Recientes", ["ID", "Cliente", "Herramienta", "Fecha Inicio", "Fecha Fin", "Estado", "Monto", "Acciones"], recentReservations)}
      </div>
    `
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return `<div class="error-message">Error al cargar los datos del dashboard.</div>`
  }
}

// === Vista de Usuarios ===
async function createAdminUsersView() {
  try {
    const users = await apiService.getUsers()

    const userData = users.map((user) => [
      user.id,
      user.name || "Nombre no disponible",
      user.email || "Email no disponible",
      user.role || "Rol no definido",
      new Date().toLocaleDateString(), // Since backend doesn't have registration date in DTO
      `<span class="status status-${user.active ? "available" : "maintenance"}">${user.active ? "Activo" : "Inactivo"}</span>`,
      '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i> <i class="fas fa-trash action-icon"></i>',
    ])

    return `
      <div class="view admin-view admin-users-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Gestión de Usuarios</div>
          <div class="action-buttons">
            <button class="btn btn-secondary">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary">
              <i class="fas fa-plus"></i>
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>
        ${createTable("Usuarios Registrados", ["ID", "Nombre", "Email", "Rol", "Fecha Registro", "Estado", "Acciones"], userData)}
      </div>
    `
  } catch (error) {
    console.error("Error fetching users:", error)
    return `<div class="error-message">Error al cargar la lista de usuarios.</div>`
  }
}

// === Vista de Reservas ===
async function createAdminReservationsView() {
  try {
    const [reservations, suppliers] = await Promise.all([apiService.getReservations(), apiService.getSuppliers()])

    const reservationData = reservations.map((reservation) => {
      const supplier = suppliers.find((s) => s.id === reservation.supplierId) || { name: "Proveedor no encontrado" }
      return [
        reservation.id,
        reservation.client?.name || "Cliente no disponible",
        supplier.name,
        reservation.tool?.name || "Herramienta no disponible",
        reservation.startDate || "No especificada",
        reservation.endDate || "No especificada",
        `<span class="status status-${reservation.status?.toLowerCase() || "unknown"}">${reservation.status || "Desconocido"}</span>`,
        `$${Number.parseFloat(reservation.totalCost || 0).toFixed(2)}`,
        '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>',
      ]
    })

    return `
      <div class="view admin-view admin-reservations-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Historial de Reservas</div>
          <div class="action-buttons">
            <button class="btn btn-secondary">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
          </div>
        </div>
        ${createTable("Todas las Reservas", ["ID", "Cliente", "Proveedor", "Herramienta", "Fecha Inicio", "Fecha Fin", "Estado", "Monto", "Acciones"], reservationData)}
      </div>
    `
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return `<div class="error-message">Error al cargar la lista de reservas.</div>`
  }
}

// === Vista de Reportes ===
async function createAdminReportsView() {
  try {
    const [tools, suppliers, reservations] = await Promise.all([
      apiService.getTools(),
      apiService.getSuppliers(),
      apiService.getReservations(),
    ])

    // Agrupar por categoría
    const toolsByCategory = {}
    if (Array.isArray(tools)) {
      tools.forEach((tool) => {
        const category = tool.category || "Sin categoría"
        toolsByCategory[category] = (toolsByCategory[category] || 0) + 1
      })
    }

    // Proveedor más activo
    const activeSupplier = (Array.isArray(suppliers) ? suppliers : []).sort((a, b) => {
      const countA = (Array.isArray(reservations) ? reservations.filter((r) => r.supplierId === a.id) : []).length
      const countB = (Array.isArray(reservations) ? reservations.filter((r) => r.supplierId === b.id) : []).length
      return countB - countA
    })[0]

    return `
      <div class="view admin-view admin-reports-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Reportes y Estadísticas</div>
          <div class="action-buttons">
            <button class="btn btn-secondary"><i class="fas fa-calendar"></i><span>Periodo</span></button>
            <button class="btn btn-primary"><i class="fas fa-download"></i><span>Exportar</span></button>
          </div>
        </div>
        <div class="stats-container">
          ${createStatCard("Categoría Más Popular", Object.keys(toolsByCategory)[0] || "Ninguna", "fas fa-tools", "#10b981", { text: "Mayor cantidad de herramientas" })}
          ${createStatCard("Proveedor Más Activo", activeSupplier?.name || "Ninguno", "fas fa-store", "#6366f1", { text: "Mayor cantidad de reservas" })}
          ${createStatCard("Total Categorías", Object.keys(toolsByCategory).length.toString(), "fas fa-tags", "#f59e0b", { text: "Categorías registradas" })}
          ${createStatCard("Promedio Reservas/Día", "8.5", "fas fa-chart-line", "#ef4444", { text: "Últimos 30 días" })}
        </div>
      </div>
    `
  } catch (error) {
    console.error("Error fetching reports:", error)
    return `<div class="error-message">Error al cargar reportes.</div>`
  }
}

// === Función principal para crear todas las vistas ===
export async function createAdminViews() {
  try {
    const dashboard = await createAdminDashboardView()
    const users = await createAdminUsersView()
    const reservations = await createAdminReservationsView()
    const reports = await createAdminReportsView()

    return `${dashboard}${users}${reservations}${reports}`
  } catch (error) {
    console.error("Error creating admin views:", error)
    return `<div class="error-message">Error al cargar las vistas de administrador.</div>`
  }
}
