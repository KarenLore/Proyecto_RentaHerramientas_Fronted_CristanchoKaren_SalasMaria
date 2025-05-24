import { apiService } from "../services/apiService.js"
import { createStatCard } from "../components/cards.js"
import { createTable } from "../components/tables.js"

async function createProviderDashboardView() {
  try {
    const [tools, reservations] = await Promise.all([apiService.getTools(), apiService.getReservations()])

    // Filter tools and reservations for current supplier (assuming supplierId = 1)
    const providerTools = tools.filter((tool) => tool.supplier?.id === 1)
    const providerReservations = reservations.filter((r) => r.supplier?.id === 1)

    const stats = {
      tools: {
        value: providerTools.length.toString(),
        change: { type: "positive", icon: "fas fa-arrow-up", text: "5% desde el mes pasado" },
      },
      reservations: {
        value: providerReservations.length.toString(),
        change: { type: "positive", icon: "fas fa-arrow-up", text: "12% desde el mes pasado" },
      },
      income: {
        value: `$${providerReservations.reduce((sum, r) => sum + Number.parseFloat(r.totalCost || 0), 0).toFixed(2)}`,
        change: { type: "positive", icon: "fas fa-arrow-up", text: "8% desde el mes pasado" },
      },
      occupation: {
        value: `${Math.min((providerReservations.length / Math.max(providerTools.length, 1)) * 100, 100).toFixed(0)}%`,
        change: { type: "positive", icon: "fas fa-arrow-up", text: "3% desde el mes pasado" },
      },
    }

    const recentRequests = providerReservations
      .slice(0, 3)
      .map((reservation) => [
        reservation.id,
        reservation.client?.name || "Cliente no disponible",
        reservation.tool?.name || "Herramienta no disponible",
        reservation.reservationDate
          ? new Date(reservation.reservationDate).toLocaleDateString()
          : new Date().toLocaleDateString(),
        reservation.startDate || "No especificada",
        reservation.endDate || "No especificada",
        `<span class="status status-${reservation.status?.toLowerCase() || "unknown"}">${reservation.status || "Desconocido"}</span>`,
        '<i class="fas fa-check-circle action-icon"></i> <i class="fas fa-times-circle action-icon"></i>',
      ])

    return `
      <div class="view provider-view provider-dashboard-view">
        <div class="dashboard-header">
          <div class="dashboard-title">Panel de Proveedor</div>
          <div class="action-buttons">
            <button class="btn btn-secondary">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
            <button class="btn btn-primary" id="addToolBtn">
              <i class="fas fa-plus"></i>
              <span>Nueva Herramienta</span>
            </button>
          </div>
        </div>
        <div class="stats-container">
          ${createStatCard("Herramientas Totales", stats.tools.value, "fas fa-tools", "#10b981", stats.tools.change)}
          ${createStatCard("Reservas Activas", stats.reservations.value, "fas fa-clipboard-list", "#f59e0b", stats.reservations.change)}
          ${createStatCard("Ingresos Mensuales", stats.income.value, "fas fa-dollar-sign", "#6366f1", stats.income.change)}
          ${createStatCard("Tasa de Ocupación", stats.occupation.value, "fas fa-percentage", "#ef4444", stats.occupation.change)}
        </div>
        ${createTable("Solicitudes Recientes", ["ID", "Cliente", "Herramienta", "Fecha Solicitud", "Fecha Inicio", "Fecha Fin", "Estado", "Acciones"], recentRequests)}
      </div>
    `
  } catch (error) {
    console.error("Error fetching provider dashboard data:", error)
    return `<div class="error-message">Error al cargar los datos del dashboard.</div>`
  }
}

async function createProviderToolsView() {
  try {
    const tools = await apiService.getTools()
    const myTools = tools.filter((tool) => tool.supplier?.id === 1) // Filter by current supplier

    const available = myTools.filter((t) => t.active && t.availableQuantity > 0).length
    const rented = myTools.filter((t) => t.active && t.availableQuantity === 0).length
    const maintenance = myTools.filter((t) => !t.active).length

    const toolCards = myTools
      .slice(0, 6)
      .map(
        (tool) => `
      <div class="tool-card">
        <div class="tool-image">
          <img src="/placeholder.svg?height=200&width=320" alt="${tool.name}" />
          <div class="tool-status-badge status-${tool.active ? "available" : "maintenance"}">
            ${tool.active ? "Activa" : "Mantenimiento"}
          </div>
        </div>
        <div class="tool-details">
          <div class="tool-name">${tool.name}</div>
          <div class="tool-category">
            <i class="fas fa-tag"></i>
            ${tool.category || "Sin categoría"}
          </div>
          <div class="tool-price">$${Number.parseFloat(tool.costPerDay || 0).toFixed(2)} / día</div>
          <div class="tool-description">${tool.description || "Sin descripción disponible"}</div>
          <div class="tool-actions">
            <button class="btn btn-secondary">
              <i class="fas fa-edit"></i>
              Editar
            </button>
            <button class="btn btn-primary">
              <i class="fas fa-eye"></i>
              Detalles
            </button>
          </div>
        </div>
      </div>
    `,
      )
      .join("")

    return `
      <div class="view provider-view provider-tools-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Mis Herramientas</div>
          <div class="action-buttons">
            <button class="btn btn-secondary">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary" id="addToolBtn">
              <i class="fas fa-plus"></i>
              <span>Nueva Herramienta</span>
            </button>
          </div>
        </div>
        <div class="stats-container">
          ${createStatCard("Herramientas Disponibles", available.toString(), "fas fa-check-circle", "#10b981", { text: `${Math.round((available / Math.max(myTools.length, 1)) * 100)}% del inventario` })}
          ${createStatCard("Herramientas Alquiladas", rented.toString(), "fas fa-clock", "#f59e0b", { text: `${Math.round((rented / Math.max(myTools.length, 1)) * 100)}% del inventario` })}
          ${createStatCard("En Mantenimiento", maintenance.toString(), "fas fa-tools", "#ef4444", { type: "negative", icon: "fas fa-arrow-up", text: "2 más que el mes pasado" })}
          ${createStatCard("Categorías", [...new Set(myTools.map((t) => t.category))].length.toString(), "fas fa-tags", "#6366f1", { type: "positive", icon: "fas fa-arrow-up", text: "1 nueva categoría" })}
        </div>
        <div class="tools-grid">
          ${toolCards}
        </div>
      </div>
    `
  } catch (error) {
    console.error("Error fetching tools:", error)
    return `<div class="error-message">Error al cargar tus herramientas.</div>`
  }
}

async function createProviderReservationsView() {
  try {
    const [reservations, tools] = await Promise.all([apiService.getReservations(), apiService.getTools()])

    const providerReservations = reservations.filter((r) => r.supplier?.id === 1)

    const pending = providerReservations.filter((r) => r.status === "PENDING").length
    const active = providerReservations.filter((r) => r.status === "APPROVED").length
    const completed = providerReservations.filter((r) => r.status === "COMPLETED").length

    const reservationRows = providerReservations.slice(0, 5).map((reservation) => {
      const tool = tools.find((t) => t.id === reservation.toolId) || { name: "Herramienta no encontrada" }
      return [
        reservation.id,
        reservation.client?.name || "Cliente no disponible",
        tool.name,
        reservation.reservationDate
          ? new Date(reservation.reservationDate).toLocaleDateString()
          : new Date().toLocaleDateString(),
        reservation.startDate || "No especificada",
        reservation.endDate || "No especificada",
        `<span class="status status-${reservation.status?.toLowerCase() || "unknown"}">${reservation.status || "Desconocido"}</span>`,
        '<i class="fas fa-check-circle action-icon"></i> <i class="fas fa-times-circle action-icon"></i>',
      ]
    })

    return `
      <div class="view provider-view provider-reservations-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Gestión de Reservas</div>
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
        <div class="stats-container">
          ${createStatCard("Solicitudes Nuevas", pending.toString(), "fas fa-bell", "#6366f1", { type: "positive", icon: "fas fa-arrow-up", text: "3 más que ayer" })}
          ${createStatCard("Reservas Activas", active.toString(), "fas fa-clipboard-list", "#f59e0b", { type: "positive", icon: "fas fa-arrow-up", text: "5 más que ayer" })}
          ${createStatCard("Completadas Hoy", completed.toString(), "fas fa-undo", "#10b981", { text: "Finalizadas hoy" })}
          ${createStatCard("Reportes Pendientes", "0", "fas fa-exclamation-triangle", "#ef4444", { type: "negative", icon: "fas fa-arrow-up", text: "0 nuevos" })}
        </div>
        ${createTable("Solicitudes de Reserva", ["ID", "Cliente", "Herramienta", "Fecha Solicitud", "Fecha Inicio", "Fecha Fin", "Estado", "Acciones"], reservationRows)}
      </div>
    `
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return `<div class="error-message">Error al cargar las reservas.</div>`
  }
}

async function createProviderBillingView() {
  try {
    const reservations = await apiService.getReservations()
    const providerReservations = reservations.filter((r) => r.supplier?.id === 1)

    const totalIncome = providerReservations.reduce((sum, r) => sum + Number.parseFloat(r.totalCost || 0), 0)
    const monthlyIncome = totalIncome * 0.08 // Example: 8% of total income

    const invoiceRows = providerReservations
      .slice(0, 3)
      .map((reservation) => [
        `F-${reservation.id}`,
        reservation.client?.name || "Cliente no disponible",
        reservation.reservationDate
          ? new Date(reservation.reservationDate).toLocaleDateString()
          : new Date().toLocaleDateString(),
        reservation.tool?.name || "Herramienta no disponible",
        `$${Number.parseFloat(reservation.totalCost || 0).toFixed(2)}`,
        `<span class="status status-available">Pagada</span>`,
        '<i class="fas fa-eye action-icon"></i> <i class="fas fa-download action-icon"></i>',
      ])

    return `
      <div class="view provider-view provider-billing-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Facturación</div>
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
        <div class="stats-container">
          ${createStatCard("Ingresos Totales", `$${totalIncome.toFixed(2)}`, "fas fa-dollar-sign", "#10b981", { type: "positive", icon: "fas fa-arrow-up", text: "12% desde el año pasado" })}
          ${createStatCard("Ingresos Mensuales", `$${monthlyIncome.toFixed(2)}`, "fas fa-chart-line", "#6366f1", { type: "positive", icon: "fas fa-arrow-up", text: "8% desde el mes pasado" })}
          ${createStatCard("Facturas Pendientes", "0", "fas fa-file-invoice-dollar", "#f59e0b", { type: "negative", icon: "fas fa-arrow-up", text: "0 nuevas" })}
          ${createStatCard("Comisión Plataforma", `$${(monthlyIncome * 0.1).toFixed(2)}`, "fas fa-percentage", "#ef4444", { text: "10% de los ingresos" })}
        </div>
        ${createTable("Facturas Recientes", ["ID Factura", "Cliente", "Fecha", "Herramienta", "Monto", "Estado", "Acciones"], invoiceRows)}
      </div>
    `
  } catch (error) {
    console.error("Error fetching billing data:", error)
    return `<div class="error-message">Error al cargar la facturación.</div>`
  }
}

export async function createProviderViews() {
  return `
    ${await createProviderDashboardView()}
    ${await createProviderToolsView()}
    ${await createProviderReservationsView()}
    ${await createProviderBillingView()}
  `
}
