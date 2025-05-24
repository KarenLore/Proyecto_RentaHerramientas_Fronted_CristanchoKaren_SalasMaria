import { apiService } from "../services/apiService.js"
import { createStatCard } from "../components/cards.js"
import { createTable } from "../components/tables.js"

// === Función auxiliar para crear tarjetas de herramientas ===
function createToolCard(tool) {
  return `
    <div class="tool-card">
      <div class="tool-image">
        <img src="/placeholder.svg?height=200&width=320" alt="${tool.name}" />
        <div class="tool-status-badge status-${tool.active ? "available" : "maintenance"}">
          ${tool.active ? "Disponible" : "No disponible"}
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
            <i class="fas fa-eye"></i>
            Ver detalles
          </button>
          <button class="btn btn-primary" ${!tool.active || tool.availableQuantity === 0 ? "disabled" : ""}>
            <i class="fas fa-shopping-cart"></i>
            ${tool.active && tool.availableQuantity > 0 ? "Alquilar" : "No disponible"}
          </button>
        </div>
      </div>
    </div>
  `
}

// === Vista de Dashboard de Cliente ===
async function createClientDashboardView() {
  try {
    const [reservations, tools, invoices] = await Promise.all([
      apiService.getReservations(),
      apiService.getTools(),
      apiService.getInvoices(),
    ])

    // Filter reservations for current client (assuming clientId = 1)
    const clientReservations = reservations.filter((r) => r.client?.id === 1)
    const activeReservations = clientReservations.filter((r) => r.status === "APPROVED")
    const pendingPayments = invoices.filter((i) => i.status === "PENDING")

    return `
      <div class="view client-view client-dashboard-view">
        <div class="dashboard-header">
          <div class="dashboard-title">Mi Panel</div>
          <div class="action-buttons">
            <button class="btn btn-primary">
              <i class="fas fa-search"></i>
              <span>Buscar Herramientas</span>
            </button>
          </div>
        </div>

        <div class="stats-container">
          ${createStatCard("Reservas Activas", activeReservations.length.toString(), "fas fa-clipboard-list", "#f59e0b", { text: "Última devolución: hace 2 semanas" })}
          ${createStatCard("Historial de Reservas", clientReservations.length.toString(), "fas fa-history", "#6366f1", { text: "Última: hace 3 semanas" })}
          ${createStatCard("Pagos Pendientes", pendingPayments.length.toString(), "fas fa-file-invoice-dollar", "#ef4444", { text: "Vence: 20/05/2023" })}
          ${createStatCard("Herramientas Favoritas", "5", "fas fa-heart", "#10b981", { text: "Taladro Industrial añadido recientemente" })}
        </div>

        ${createTable(
          "Mis Reservas Activas",
          ["ID", "Herramienta", "Proveedor", "Fecha Inicio", "Fecha Fin", "Monto", "Estado", "Acciones"],
          activeReservations
            .slice(0, 3)
            .map((reservation) => [
              reservation.id,
              reservation.tool?.name || "Herramienta no disponible",
              reservation.supplier?.name || "Proveedor no encontrado",
              reservation.startDate || "No especificada",
              reservation.endDate || "No especificada",
              `$${Number.parseFloat(reservation.totalCost || 0).toFixed(2)}`,
              `<span class="status status-rented">${reservation.status || "En Proceso"}</span>`,
              '<i class="fas fa-eye action-icon"></i> <i class="fas fa-undo action-icon"></i>',
            ]),
        )}
      </div>
    `
  } catch (error) {
    console.error("Error fetching client dashboard data:", error)
    return `<div class="error-message">Error al cargar los datos del dashboard.</div>`
  }
}

// === Vista de Explorar Herramientas ===
async function createClientExploreView() {
  try {
    const tools = await apiService.getTools()
    const availableTools = tools.filter((tool) => tool.active)

    const toolCards = availableTools.map((tool) => createToolCard(tool)).join("")

    return `
      <div class="view client-view client-explore-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Explorar Herramientas</div>
          <div class="action-buttons">
            <button class="btn btn-secondary">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="Buscar herramientas...">
            </div>
          </div>
        </div>

        <div class="tools-grid">
          ${toolCards}
        </div>
      </div>
    `
  } catch (error) {
    console.error("Error fetching explore view:", error)
    return `<div class="error-message">Error al cargar las herramientas.</div>`
  }
}

// === Vista de Reservas del Cliente ===
async function createClientReservationsView() {
  try {
    const reservations = await apiService.getReservations()
    const userReservations = reservations.filter((r) => r.client?.id === 1)

    const activeReservations = userReservations.filter((r) => r.status === "APPROVED")
    const historyReservations = userReservations.filter((r) => r.status === "COMPLETED")

    return `
      <div class="view client-view client-reservations-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Mis Reservas</div>
          <div class="action-buttons">
            <button class="btn btn-secondary">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary">
              <i class="fas fa-search"></i>
              <span>Buscar Herramientas</span>
            </button>
          </div>
        </div>

        ${createTable(
          "Reservas Activas",
          ["ID", "Herramienta", "Proveedor", "Fecha Inicio", "Fecha Fin", "Monto", "Estado", "Acciones"],
          activeReservations.map((reservation) => [
            reservation.id,
            reservation.tool?.name || "Herramienta no disponible",
            reservation.supplier?.name || "Proveedor no encontrado",
            reservation.startDate || "No especificada",
            reservation.endDate || "No especificada",
            `$${Number.parseFloat(reservation.totalCost || 0).toFixed(2)}`,
            `<span class="status status-rented">${reservation.status || "En Proceso"}</span>`,
            '<i class="fas fa-eye action-icon"></i> <i class="fas fa-undo action-icon"></i>',
          ]),
        )}

        ${createTable(
          "Historial de Reservas",
          ["ID", "Herramienta", "Proveedor", "Fecha Inicio", "Fecha Fin", "Monto", "Estado", "Acciones"],
          historyReservations.map((reservation) => [
            reservation.id,
            reservation.tool?.name || "Herramienta no disponible",
            reservation.supplier?.name || "Proveedor no encontrado",
            reservation.startDate || "No especificada",
            reservation.endDate || "No especificada",
            `$${Number.parseFloat(reservation.totalCost || 0).toFixed(2)}`,
            `<span class="status status-available">${reservation.status || "Completado"}</span>`,
            '<i class="fas fa-eye action-icon"></i> <i class="fas fa-file-invoice action-icon"></i>',
          ]),
        )}
      </div>
    `
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return `<div class="error-message">Error al cargar tus reservas.</div>`
  }
}

// === Vista de Pagos del Cliente ===
async function createClientPaymentsView() {
  try {
    const invoices = await apiService.getInvoices()
    const userInvoices = invoices.filter((i) => i.reservation?.client?.id === 1)

    const paidInvoices = userInvoices.filter((i) => i.status === "PAID")
    const pendingInvoices = userInvoices.filter((i) => i.status === "PENDING")

    const totalPaid = paidInvoices.reduce((sum, inv) => sum + Number.parseFloat(inv.total || 0), 0)
    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + Number.parseFloat(inv.total || 0), 0)

    return `
      <div class="view client-view client-payments-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Mis Pagos</div>
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
          ${createStatCard("Total Pagado", `$${totalPaid.toFixed(2)}`, "fas fa-dollar-sign", "#10b981", { text: "Últimos 12 meses" })}
          ${createStatCard("Pagos Pendientes", `$${pendingAmount.toFixed(2)}`, "fas fa-file-invoice-dollar", "#ef4444", { text: "Próximo vencimiento: 20/05/2023" })}
          ${createStatCard("Método de Pago", "Visa", "fas fa-credit-card", "#6366f1", { text: "Termina en 4582" })}
          ${createStatCard("Facturas Disponibles", userInvoices.length.toString(), "fas fa-file-invoice", "#f59e0b", { text: "Descargables en PDF" })}
        </div>

        ${createTable(
          "Historial de Pagos",
          ["ID Factura", "Herramienta", "Proveedor", "Fecha", "Monto", "Estado", "Acciones"],
          userInvoices
            .slice(0, 5)
            .map((invoice) => [
              `F-${invoice.id}`,
              invoice.reservation?.tool?.name || "Herramienta no disponible",
              invoice.reservation?.supplier?.name || "Proveedor no encontrado",
              invoice.issueDate || new Date().toLocaleDateString(),
              `$${Number.parseFloat(invoice.total || 0).toFixed(2)}`,
              `<span class="status status-${invoice.status === "PAID" ? "available" : "rented"}">${invoice.status || "Desconocida"}</span>`,
              '<i class="fas fa-eye action-icon"></i> <i class="fas fa-download action-icon"></i>',
            ]),
        )}
      </div>
    `
  } catch (error) {
    console.error("Error fetching payments:", error)
    return `<div class="error-message">Error al cargar tus pagos.</div>`
  }
}

// === Función principal para crear todas las vistas del cliente ===
export async function createClientViews() {
  return `
    ${await createClientDashboardView()}
    ${await createClientExploreView()}
    ${await createClientReservationsView()}
    ${await createClientPaymentsView()}
  `
}
