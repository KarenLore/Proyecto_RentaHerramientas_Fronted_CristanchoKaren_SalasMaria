import { apiService } from "../services/apiService.js"

async function createProviderDashboardView() {
  console.log("🏪 Creando vista dashboard de proveedor...")

  try {
    const [tools, reservations] = await Promise.all([
      apiService.getTools().catch(() => []),
      apiService.getReservations().catch(() => []),
    ])

    // Filter tools and reservations for current supplier (assuming supplierId = 1)
    const providerTools = tools.filter((tool) => tool.supplier?.id === 1)
    const providerReservations = reservations.filter((r) => r.supplier?.id === 1)

    const totalIncome = providerReservations.reduce((sum, r) => sum + Number.parseFloat(r.totalCost || 0), 0)
    const occupationRate = Math.min((providerReservations.length / Math.max(providerTools.length, 1)) * 100, 100)

    console.log("📊 Proveedor - Herramientas:", providerTools.length, "Reservas:", providerReservations.length)

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
        `<span class="status-badge status-${(reservation.status || "unknown").toLowerCase()}">${reservation.status || "Desconocido"}</span>`,
        '<i class="fas fa-check-circle action-icon"></i> <i class="fas fa-times-circle action-icon"></i>',
      ])

    return `
      <div class="view provider-view provider-dashboard-view dashboard-view">
        <div class="dashboard-header">
          <h1 class="dashboard-title">Panel de Proveedor</h1>
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
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Herramientas Totales</div>
                <div class="stat-card-value">${providerTools.length}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #10b981;">
                <i class="fas fa-tools"></i>
              </div>
            </div>
            <div class="stat-card-change positive">
              <i class="fas fa-arrow-up"></i>
              <span>5% desde el mes pasado</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Reservas Activas</div>
                <div class="stat-card-value">${providerReservations.length}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #f59e0b;">
                <i class="fas fa-clipboard-list"></i>
              </div>
            </div>
            <div class="stat-card-change positive">
              <i class="fas fa-arrow-up"></i>
              <span>12% desde el mes pasado</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Ingresos Mensuales</div>
                <div class="stat-card-value">$${totalIncome.toFixed(2)}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #6366f1;">
                <i class="fas fa-dollar-sign"></i>
              </div>
            </div>
            <div class="stat-card-change positive">
              <i class="fas fa-arrow-up"></i>
              <span>8% desde el mes pasado</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Tasa de Ocupación</div>
                <div class="stat-card-value">${occupationRate.toFixed(0)}%</div>
              </div>
              <div class="stat-card-icon" style="background-color: #ef4444;">
                <i class="fas fa-percentage"></i>
              </div>
            </div>
            <div class="stat-card-change positive">
              <i class="fas fa-arrow-up"></i>
              <span>3% desde el mes pasado</span>
            </div>
          </div>
        </div>

        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">Solicitudes Recientes</h3>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Herramienta</th>
                  <th>Fecha Solicitud</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${recentRequests
                  .map(
                    (row) => `
                  <tr>
                    ${row.map((cell) => `<td>${cell}</td>`).join("")}
                  </tr>
                `,
                  )
                  .join("")}
                ${recentRequests.length === 0 ? '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No hay solicitudes recientes</td></tr>' : ""}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  } catch (error) {
    console.error("❌ Error creando vista dashboard proveedor:", error)
    return `
      <div class="view provider-view provider-dashboard-view dashboard-view">
        <div class="error-message">
          <h3>Error al cargar el dashboard</h3>
          <p>Detalles: ${error.message}</p>
        </div>
      </div>
    `
  }
}

async function createProviderToolsView() {
  console.log("🔧 Creando vista herramientas proveedor...")

  try {
    const tools = await apiService.getTools().catch(() => [])
    const myTools = tools.filter((tool) => tool.supplier?.id === 1) // Filter by current supplier

    const available = myTools.filter((t) => t.active && t.availableQuantity > 0).length
    const rented = myTools.filter((t) => t.active && t.availableQuantity === 0).length
    const maintenance = myTools.filter((t) => !t.active).length

    return `
      <div class="view provider-view provider-tools-view tools-view hidden">
        <div class="dashboard-header">
          <h1 class="dashboard-title">Mis Herramientas</h1>
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
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Herramientas Disponibles</div>
                <div class="stat-card-value">${available}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #10b981;">
                <i class="fas fa-check-circle"></i>
              </div>
            </div>
            <div class="stat-card-change">
              <span>${Math.round((available / Math.max(myTools.length, 1)) * 100)}% del inventario</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Herramientas Alquiladas</div>
                <div class="stat-card-value">${rented}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #f59e0b;">
                <i class="fas fa-clock"></i>
              </div>
            </div>
            <div class="stat-card-change">
              <span>${Math.round((rented / Math.max(myTools.length, 1)) * 100)}% del inventario</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">En Mantenimiento</div>
                <div class="stat-card-value">${maintenance}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #ef4444;">
                <i class="fas fa-tools"></i>
              </div>
            </div>
            <div class="stat-card-change negative">
              <i class="fas fa-arrow-up"></i>
              <span>2 más que el mes pasado</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Categorías</div>
                <div class="stat-card-value">${[...new Set(myTools.map((t) => t.category?.name))].length}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #6366f1;">
                <i class="fas fa-tags"></i>
              </div>
            </div>
            <div class="stat-card-change positive">
              <i class="fas fa-arrow-up"></i>
              <span>1 nueva categoría</span>
            </div>
          </div>
        </div>
        
        <div class="tools-grid">
          ${myTools
            .slice(0, 6)
            .map(
              (tool) => `
            <div class="tool-card">
              <div class="tool-image">
                <img src="/placeholder.svg?height=200&width=320" alt="${tool.name}" />
                <div class="tool-status ${tool.active ? "status-available" : "status-maintenance"}">
                  ${tool.active ? "Activa" : "Mantenimiento"}
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
                    <i class="fas fa-edit"></i>
                    Editar
                  </button>
                  <button class="btn btn-primary btn-sm">
                    <i class="fas fa-eye"></i>
                    Detalles
                  </button>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
          ${myTools.length === 0 ? '<div style="text-align: center; padding: 2rem; grid-column: 1 / -1;"><p>No tienes herramientas registradas</p></div>' : ""}
        </div>
      </div>
    `
  } catch (error) {
    console.error("❌ Error creando vista herramientas:", error)
    return `<div class="view provider-view provider-tools-view tools-view hidden">Error al cargar tus herramientas</div>`
  }
}

async function createProviderReservationsView() {
  console.log("📋 Creando vista reservas proveedor...")

  try {
    const [reservations, tools] = await Promise.all([
      apiService.getReservations().catch(() => []),
      apiService.getTools().catch(() => []),
    ])

    const providerReservations = reservations.filter((r) => r.supplier?.id === 1)

    const pending = providerReservations.filter((r) => r.status === "PENDING").length
    const active = providerReservations.filter((r) => r.status === "APPROVED").length
    const completed = providerReservations.filter((r) => r.status === "COMPLETED").length

    const reservationRows = providerReservations.slice(0, 5).map((reservation) => {
      const tool = tools.find((t) => t.id === reservation.tool?.id) || { name: "Herramienta no encontrada" }
      return [
        reservation.id,
        reservation.client?.name || "Cliente no disponible",
        tool.name,
        reservation.reservationDate
          ? new Date(reservation.reservationDate).toLocaleDateString()
          : new Date().toLocaleDateString(),
        reservation.startDate || "No especificada",
        reservation.endDate || "No especificada",
        `<span class="status-badge status-${(reservation.status || "unknown").toLowerCase()}">${reservation.status || "Desconocido"}</span>`,
        '<i class="fas fa-check-circle action-icon"></i> <i class="fas fa-times-circle action-icon"></i>',
      ]
    })

    return `
      <div class="view provider-view provider-reservations-view reservations-view hidden">
        <div class="dashboard-header">
          <h1 class="dashboard-title">Gestión de Reservas</h1>
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
                <div class="stat-card-title">Solicitudes Nuevas</div>
                <div class="stat-card-value">${pending}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #6366f1;">
                <i class="fas fa-bell"></i>
              </div>
            </div>
            <div class="stat-card-change positive">
              <i class="fas fa-arrow-up"></i>
              <span>3 más que ayer</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Reservas Activas</div>
                <div class="stat-card-value">${active}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #f59e0b;">
                <i class="fas fa-clipboard-list"></i>
              </div>
            </div>
            <div class="stat-card-change positive">
              <i class="fas fa-arrow-up"></i>
              <span>5 más que ayer</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Completadas Hoy</div>
                <div class="stat-card-value">${completed}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #10b981;">
                <i class="fas fa-undo"></i>
              </div>
            </div>
            <div class="stat-card-change">
              <span>Finalizadas hoy</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Reportes Pendientes</div>
                <div class="stat-card-value">0</div>
              </div>
              <div class="stat-card-icon" style="background-color: #ef4444;">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
            </div>
            <div class="stat-card-change">
              <span>0 nuevos</span>
            </div>
          </div>
        </div>

        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">Solicitudes de Reserva</h3>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Herramienta</th>
                  <th>Fecha Solicitud</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${reservationRows
                  .map(
                    (row) => `
                  <tr>
                    ${row.map((cell) => `<td>${cell}</td>`).join("")}
                  </tr>
                `,
                  )
                  .join("")}
                ${reservationRows.length === 0 ? '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No hay solicitudes de reserva</td></tr>' : ""}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  } catch (error) {
    console.error("❌ Error creando vista reservas:", error)
    return `<div class="view provider-view provider-reservations-view reservations-view hidden">Error al cargar las reservas</div>`
  }
}

async function createProviderBillingView() {
  console.log("💰 Creando vista facturación proveedor...")

  try {
    const reservations = await apiService.getReservations().catch(() => [])
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
        `<span class="status-badge status-available">Pagada</span>`,
        '<i class="fas fa-eye action-icon"></i> <i class="fas fa-download action-icon"></i>',
      ])

    return `
      <div class="view provider-view provider-billing-view billing-view hidden">
        <div class="dashboard-header">
          <h1 class="dashboard-title">Facturación</h1>
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
                <div class="stat-card-title">Ingresos Totales</div>
                <div class="stat-card-value">$${totalIncome.toFixed(2)}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #10b981;">
                <i class="fas fa-dollar-sign"></i>
              </div>
            </div>
            <div class="stat-card-change positive">
              <i class="fas fa-arrow-up"></i>
              <span>12% desde el año pasado</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Ingresos Mensuales</div>
                <div class="stat-card-value">$${monthlyIncome.toFixed(2)}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #6366f1;">
                <i class="fas fa-chart-line"></i>
              </div>
            </div>
            <div class="stat-card-change positive">
              <i class="fas fa-arrow-up"></i>
              <span>8% desde el mes pasado</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Facturas Pendientes</div>
                <div class="stat-card-value">0</div>
              </div>
              <div class="stat-card-icon" style="background-color: #f59e0b;">
                <i class="fas fa-file-invoice-dollar"></i>
              </div>
            </div>
            <div class="stat-card-change">
              <span>0 nuevas</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Comisión Plataforma</div>
                <div class="stat-card-value">$${(monthlyIncome * 0.1).toFixed(2)}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #ef4444;">
                <i class="fas fa-percentage"></i>
              </div>
            </div>
            <div class="stat-card-change">
              <span>10% de los ingresos</span>
            </div>
          </div>
        </div>

        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">Facturas Recientes</h3>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID Factura</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Herramienta</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${invoiceRows
                  .map(
                    (row) => `
                  <tr>
                    ${row.map((cell) => `<td>${cell}</td>`).join("")}
                  </tr>
                `,
                  )
                  .join("")}
                ${invoiceRows.length === 0 ? '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No hay facturas disponibles</td></tr>' : ""}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  } catch (error) {
    console.error("❌ Error creando vista facturación:", error)
    return `<div class="view provider-view provider-billing-view billing-view hidden">Error al cargar la facturación</div>`
  }
}

export async function createProviderViews() {
  console.log("🏗️ Creando todas las vistas de proveedor...")

  const dashboard = await createProviderDashboardView()
  const tools = await createProviderToolsView()
  const reservations = await createProviderReservationsView()
  const billing = await createProviderBillingView()

  return `${dashboard}${tools}${reservations}${billing}`
}
