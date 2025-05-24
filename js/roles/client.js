import { apiService } from "../services/apiService.js"

// === Vista de Dashboard de Cliente ===
async function createClientDashboardView() {
  console.log("👤 Creando vista dashboard de cliente...")

  try {
    const [reservations, tools, invoices] = await Promise.all([
      apiService.getReservations().catch(() => []),
      apiService.getTools().catch(() => []),
      apiService.getInvoices().catch(() => []),
    ])

    // Filter reservations for current client (assuming clientId = 1)
    const clientReservations = reservations.filter((r) => r.client?.id === 1)
    const activeReservations = clientReservations.filter((r) => r.status === "APPROVED")
    const pendingPayments = invoices.filter((i) => i.status === "PENDING")

    console.log(
      "📊 Cliente - Reservas activas:",
      activeReservations.length,
      "Pagos pendientes:",
      pendingPayments.length,
    )

    return `
      <div class="view client-view client-dashboard-view dashboard-view">
        <div class="dashboard-header">
          <h1 class="dashboard-title">Mi Panel</h1>
          <div class="action-buttons">
            <button class="btn btn-primary">
              <i class="fas fa-search"></i>
              <span>Buscar Herramientas</span>
            </button>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Reservas Activas</div>
                <div class="stat-card-value">${activeReservations.length}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #f59e0b;">
                <i class="fas fa-clipboard-list"></i>
              </div>
            </div>
            <div class="stat-card-change">
              <span>Última devolución: hace 2 semanas</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Historial de Reservas</div>
                <div class="stat-card-value">${clientReservations.length}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #6366f1;">
                <i class="fas fa-history"></i>
              </div>
            </div>
            <div class="stat-card-change">
              <span>Última: hace 3 semanas</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Pagos Pendientes</div>
                <div class="stat-card-value">${pendingPayments.length}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #ef4444;">
                <i class="fas fa-file-invoice-dollar"></i>
              </div>
            </div>
            <div class="stat-card-change">
              <span>Vence: 20/05/2023</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Herramientas Favoritas</div>
                <div class="stat-card-value">5</div>
              </div>
              <div class="stat-card-icon" style="background-color: #10b981;">
                <i class="fas fa-heart"></i>
              </div>
            </div>
            <div class="stat-card-change">
              <span>Taladro Industrial añadido recientemente</span>
            </div>
          </div>
        </div>

        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">Mis Reservas Activas</h3>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Herramienta</th>
                  <th>Proveedor</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${activeReservations
                  .slice(0, 3)
                  .map(
                    (reservation) => `
                  <tr>
                    <td>${reservation.id}</td>
                    <td>${reservation.tool?.name || "Herramienta no disponible"}</td>
                    <td>${reservation.supplier?.name || "Proveedor no encontrado"}</td>
                    <td>${reservation.startDate || "No especificada"}</td>
                    <td>${reservation.endDate || "No especificada"}</td>
                    <td>$${Number.parseFloat(reservation.totalCost || 0).toFixed(2)}</td>
                    <td><span class="status-badge status-rented">${reservation.status || "En Proceso"}</span></td>
                    <td>
                      <i class="fas fa-eye action-icon"></i>
                      <i class="fas fa-undo action-icon"></i>
                    </td>
                  </tr>
                `,
                  )
                  .join("")}
                ${activeReservations.length === 0 ? '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No tienes reservas activas</td></tr>' : ""}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  } catch (error) {
    console.error("❌ Error creando vista dashboard cliente:", error)
    return `
      <div class="view client-view client-dashboard-view dashboard-view">
        <div class="error-message">
          <h3>Error al cargar el dashboard</h3>
          <p>Detalles: ${error.message}</p>
        </div>
      </div>
    `
  }
}

// === Vista de Explorar Herramientas ===
async function createClientExploreView() {
  console.log("🔍 Creando vista explorar herramientas...")

  try {
    const tools = await apiService.getTools().catch(() => [])
    const availableTools = tools.filter((tool) => tool.active)

    console.log("🔧 Herramientas disponibles:", availableTools.length)

    return `
      <div class="view client-view client-explore-view explore-view hidden">
        <div class="dashboard-header">
          <h1 class="dashboard-title">Explorar Herramientas</h1>
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
          ${availableTools
            .slice(0, 8)
            .map(
              (tool) => `
            <div class="tool-card">
              <div class="tool-image">
                <img src="/placeholder.svg?height=200&width=320" alt="${tool.name}" />
                <div class="tool-status ${tool.active ? "status-available" : "status-maintenance"}">
                  ${tool.active ? "Disponible" : "No disponible"}
                </div>
              </div>
              <div class="tool-info">
                <h3 class="tool-name">${tool.name}</h3>
                <p class="tool-category">
                  <i class="fas fa-tag"></i>
                  ${tool.category?.name || "Sin categoría"}
                </p>
                <p class="tool-price">$${Number.parseFloat(tool.costPerDay || 0).toFixed(2)} / día</p>
                <p class="tool-description">${tool.description || "Sin descripción disponible"}</p>
                <div class="tool-actions">
                  <button class="btn btn-secondary btn-sm">
                    <i class="fas fa-eye"></i>
                    Ver detalles
                  </button>
                  <button class="btn btn-primary btn-sm" ${!tool.active || tool.availableQuantity === 0 ? "disabled" : ""}>
                    <i class="fas fa-shopping-cart"></i>
                    ${tool.active && tool.availableQuantity > 0 ? "Alquilar" : "No disponible"}
                  </button>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
          ${availableTools.length === 0 ? '<div style="text-align: center; padding: 2rem; grid-column: 1 / -1;"><p>No hay herramientas disponibles en este momento</p></div>' : ""}
        </div>
      </div>
    `
  } catch (error) {
    console.error("❌ Error creando vista explorar:", error)
    return `<div class="view client-view client-explore-view explore-view hidden">Error al cargar las herramientas</div>`
  }
}

// === Vista de Reservas del Cliente ===
async function createClientReservationsView() {
  console.log("📋 Creando vista reservas cliente...")

  try {
    const reservations = await apiService.getReservations().catch(() => [])
    const userReservations = reservations.filter((r) => r.client?.id === 1)

    const activeReservations = userReservations.filter((r) => r.status === "APPROVED")
    const historyReservations = userReservations.filter((r) => r.status === "COMPLETED")

    return `
      <div class="view client-view client-reservations-view reservations-view hidden">
        <div class="dashboard-header">
          <h1 class="dashboard-title">Mis Reservas</h1>
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

        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">Reservas Activas</h3>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Herramienta</th>
                  <th>Proveedor</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${activeReservations
                  .map(
                    (reservation) => `
                  <tr>
                    <td>${reservation.id}</td>
                    <td>${reservation.tool?.name || "Herramienta no disponible"}</td>
                    <td>${reservation.supplier?.name || "Proveedor no encontrado"}</td>
                    <td>${reservation.startDate || "No especificada"}</td>
                    <td>${reservation.endDate || "No especificada"}</td>
                    <td>$${Number.parseFloat(reservation.totalCost || 0).toFixed(2)}</td>
                    <td><span class="status-badge status-rented">${reservation.status || "En Proceso"}</span></td>
                    <td>
                      <i class="fas fa-eye action-icon"></i>
                      <i class="fas fa-undo action-icon"></i>
                    </td>
                  </tr>
                `,
                  )
                  .join("")}
                ${activeReservations.length === 0 ? '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No tienes reservas activas</td></tr>' : ""}
              </tbody>
            </table>
          </div>
        </div>

        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">Historial de Reservas</h3>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Herramienta</th>
                  <th>Proveedor</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${historyReservations
                  .map(
                    (reservation) => `
                  <tr>
                    <td>${reservation.id}</td>
                    <td>${reservation.tool?.name || "Herramienta no disponible"}</td>
                    <td>${reservation.supplier?.name || "Proveedor no encontrado"}</td>
                    <td>${reservation.startDate || "No especificada"}</td>
                    <td>${reservation.endDate || "No especificada"}</td>
                    <td>$${Number.parseFloat(reservation.totalCost || 0).toFixed(2)}</td>
                    <td><span class="status-badge status-available">${reservation.status || "Completado"}</span></td>
                    <td>
                      <i class="fas fa-eye action-icon"></i>
                      <i class="fas fa-file-invoice action-icon"></i>
                    </td>
                  </tr>
                `,
                  )
                  .join("")}
                ${historyReservations.length === 0 ? '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No tienes historial de reservas</td></tr>' : ""}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  } catch (error) {
    console.error("❌ Error creando vista reservas:", error)
    return `<div class="view client-view client-reservations-view reservations-view hidden">Error al cargar tus reservas</div>`
  }
}

// === Vista de Pagos del Cliente ===
async function createClientPaymentsView() {
  console.log("💳 Creando vista pagos cliente...")

  try {
    const invoices = await apiService.getInvoices().catch(() => [])
    const userInvoices = invoices.filter((i) => i.reservation?.client?.id === 1)

    const paidInvoices = userInvoices.filter((i) => i.status === "PAID")
    const pendingInvoices = userInvoices.filter((i) => i.status === "PENDING")

    const totalPaid = paidInvoices.reduce((sum, inv) => sum + Number.parseFloat(inv.total || 0), 0)
    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + Number.parseFloat(inv.total || 0), 0)

    return `
      <div class="view client-view client-payments-view payments-view hidden">
        <div class="dashboard-header">
          <h1 class="dashboard-title">Mis Pagos</h1>
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

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Total Pagado</div>
                <div class="stat-card-value">$${totalPaid.toFixed(2)}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #10b981;">
                <i class="fas fa-dollar-sign"></i>
              </div>
            </div>
            <div class="stat-card-change">
              <span>Últimos 12 meses</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Pagos Pendientes</div>
                <div class="stat-card-value">$${pendingAmount.toFixed(2)}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #ef4444;">
                <i class="fas fa-file-invoice-dollar"></i>
              </div>
            </div>
            <div class="stat-card-change">
              <span>Próximo vencimiento: 20/05/2023</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Método de Pago</div>
                <div class="stat-card-value">Visa</div>
              </div>
              <div class="stat-card-icon" style="background-color: #6366f1;">
                <i class="fas fa-credit-card"></i>
              </div>
            </div>
            <div class="stat-card-change">
              <span>Termina en 4582</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Facturas Disponibles</div>
                <div class="stat-card-value">${userInvoices.length}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #f59e0b;">
                <i class="fas fa-file-invoice"></i>
              </div>
            </div>
            <div class="stat-card-change">
              <span>Descargables en PDF</span>
            </div>
          </div>
        </div>

        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">Historial de Pagos</h3>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID Factura</th>
                  <th>Herramienta</th>
                  <th>Proveedor</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${userInvoices
                  .slice(0, 5)
                  .map(
                    (invoice) => `
                  <tr>
                    <td>F-${invoice.id}</td>
                    <td>${invoice.reservation?.tool?.name || "Herramienta no disponible"}</td>
                    <td>${invoice.reservation?.supplier?.name || "Proveedor no encontrado"}</td>
                    <td>${invoice.issueDate || new Date().toLocaleDateString()}</td>
                    <td>$${Number.parseFloat(invoice.total || 0).toFixed(2)}</td>
                    <td><span class="status-badge status-${invoice.status === "PAID" ? "available" : "rented"}">${invoice.status || "Desconocida"}</span></td>
                    <td>
                      <i class="fas fa-eye action-icon"></i>
                      <i class="fas fa-download action-icon"></i>
                    </td>
                  </tr>
                `,
                  )
                  .join("")}
                ${userInvoices.length === 0 ? '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No tienes facturas disponibles</td></tr>' : ""}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  } catch (error) {
    console.error("❌ Error creando vista pagos:", error)
    return `<div class="view client-view client-payments-view payments-view hidden">Error al cargar tus pagos</div>`
  }
}

// === Función principal para crear todas las vistas del cliente ===
export async function createClientViews() {
  console.log("🏗️ Creando todas las vistas de cliente...")

  const dashboard = await createClientDashboardView()
  const explore = await createClientExploreView()
  const reservations = await createClientReservationsView()
  const payments = await createClientPaymentsView()

  return `${dashboard}${explore}${reservations}${payments}`
}
