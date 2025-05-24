import { apiService } from "../services/apiService.js"

// === Vista del Dashboard ===
async function createAdminDashboardView() {
  console.log("📊 Creando vista dashboard de admin...")

  try {
    const [users, tools, reservations] = await Promise.all([
      apiService.getUsers().catch(() => []),
      apiService.getTools().catch(() => []),
      apiService.getReservations().catch(() => []),
    ])

    console.log(
      "📈 Datos cargados - Usuarios:",
      users.length,
      "Herramientas:",
      tools.length,
      "Reservas:",
      reservations.length,
    )

    const recentReservations = reservations
      .slice(0, 5)
      .map((reservation) => [
        reservation.id || "N/A",
        reservation.client?.name || "Cliente no disponible",
        reservation.tool?.name || "Herramienta no disponible",
        reservation.startDate || "No especificada",
        reservation.endDate || "No especificada",
        `<span class="status-badge status-${(reservation.status || "unknown").toLowerCase()}">${reservation.status || "Desconocido"}</span>`,
        `$${Number.parseFloat(reservation.totalCost || 0).toFixed(2)}`,
        '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>',
      ])

    return `
      <div class="view admin-view admin-dashboard-view dashboard-view">
        <div class="dashboard-header">
          <h1 class="dashboard-title">Panel de Administrador</h1>
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
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-title">Usuarios Totales</div>
                <div class="stat-card-value">${users.length}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #6366f1;">
                <i class="fas fa-users"></i>
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
                <div class="stat-card-title">Herramientas</div>
                <div class="stat-card-value">${tools.length}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #10b981;">
                <i class="fas fa-tools"></i>
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
                <div class="stat-card-title">Reservas</div>
                <div class="stat-card-value">${reservations.length}</div>
              </div>
              <div class="stat-card-icon" style="background-color: #f59e0b;">
                <i class="fas fa-clipboard-list"></i>
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
                <div class="stat-card-title">Ingresos</div>
                <div class="stat-card-value">$12,450</div>
              </div>
              <div class="stat-card-icon" style="background-color: #ef4444;">
                <i class="fas fa-dollar-sign"></i>
              </div>
            </div>
            <div class="stat-card-change positive">
              <i class="fas fa-arrow-up"></i>
              <span>15% desde el mes pasado</span>
            </div>
          </div>
        </div>

        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">Reservas Recientes</h3>
            <div class="table-actions">
              <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Buscar...">
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Herramienta</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Estado</th>
                  <th>Monto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${recentReservations
                  .map(
                    (row) => `
                  <tr>
                    ${row.map((cell) => `<td>${cell}</td>`).join("")}
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  } catch (error) {
    console.error("❌ Error creando vista dashboard admin:", error)
    return `
      <div class="view admin-view admin-dashboard-view dashboard-view">
        <div class="error-message">
          <h3>Error al cargar el dashboard</h3>
          <p>Detalles: ${error.message}</p>
        </div>
      </div>
    `
  }
}

// === Vista de Usuarios ===
async function createAdminUsersView() {
  console.log("👥 Creando vista de usuarios...")

  try {
    const users = await apiService.getUsers().catch(() => [])

    const userData = users.map((user) => [
      user.id || "N/A",
      user.name || "Nombre no disponible",
      user.email || "Email no disponible",
      user.role || "Rol no definido",
      new Date().toLocaleDateString(),
      `<span class="status-badge status-${user.active ? "available" : "maintenance"}">${user.active ? "Activo" : "Inactivo"}</span>`,
      '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i> <i class="fas fa-trash action-icon"></i>',
    ])

    return `
      <div class="view admin-view admin-users-view users-view hidden">
        <div class="dashboard-header">
          <h1 class="dashboard-title">Gestión de Usuarios</h1>
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
        
        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">Usuarios Registrados</h3>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Fecha Registro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${userData
                  .map(
                    (row) => `
                  <tr>
                    ${row.map((cell) => `<td>${cell}</td>`).join("")}
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  } catch (error) {
    console.error("❌ Error creando vista usuarios:", error)
    return `<div class="view admin-view admin-users-view users-view hidden">Error al cargar usuarios</div>`
  }
}

// === Vista de Herramientas ===
async function createAdminToolsView() {
  console.log("🔧 Creando vista de herramientas...")

  try {
    const tools = await apiService.getTools().catch(() => [])

    return `
      <div class="view admin-view admin-tools-view tools-view hidden">
        <div class="dashboard-header">
          <h1 class="dashboard-title">Gestión de Herramientas</h1>
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
        
        <div class="tools-grid">
          ${tools
            .slice(0, 8)
            .map(
              (tool) => `
            <div class="tool-card">
              <div class="tool-image">
                <img src="/placeholder.svg?height=200&width=320" alt="${tool.name || "Herramienta"}" />
                <div class="tool-status ${tool.active ? "status-available" : "status-maintenance"}">
                  ${tool.active ? "Disponible" : "Mantenimiento"}
                </div>
              </div>
              <div class="tool-info">
                <h3 class="tool-name">${tool.name || "Sin nombre"}</h3>
                <p class="tool-category">${tool.category?.name || "Sin categoría"}</p>
                <p class="tool-price">$${Number.parseFloat(tool.costPerDay || 0).toFixed(2)} / día</p>
                <div class="tool-actions">
                  <button class="btn btn-secondary btn-sm">
                    <i class="fas fa-edit"></i> Editar
                  </button>
                  <button class="btn btn-primary btn-sm">
                    <i class="fas fa-eye"></i> Ver
                  </button>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `
  } catch (error) {
    console.error("❌ Error creando vista herramientas:", error)
    return `<div class="view admin-view admin-tools-view tools-view hidden">Error al cargar herramientas</div>`
  }
}

// === Vista de Reservas ===
async function createAdminReservationsView() {
  console.log("📋 Creando vista de reservas...")

  try {
    const reservations = await apiService.getReservations().catch(() => [])

    return `
      <div class="view admin-view admin-reservations-view reservations-view hidden">
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
        
        <div class="table-container">
          <div class="table-header">
            <h3 class="table-title">Todas las Reservas</h3>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Herramienta</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Estado</th>
                  <th>Monto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${reservations
                  .map(
                    (reservation) => `
                  <tr>
                    <td>${reservation.id || "N/A"}</td>
                    <td>${reservation.client?.name || "Cliente no disponible"}</td>
                    <td>${reservation.tool?.name || "Herramienta no disponible"}</td>
                    <td>${reservation.startDate || "No especificada"}</td>
                    <td>${reservation.endDate || "No especificada"}</td>
                    <td><span class="status-badge status-${(reservation.status || "unknown").toLowerCase()}">${reservation.status || "Desconocido"}</span></td>
                    <td>$${Number.parseFloat(reservation.totalCost || 0).toFixed(2)}</td>
                    <td>
                      <i class="fas fa-eye action-icon"></i>
                      <i class="fas fa-edit action-icon"></i>
                    </td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  } catch (error) {
    console.error("❌ Error creando vista reservas:", error)
    return `<div class="view admin-view admin-reservations-view reservations-view hidden">Error al cargar reservas</div>`
  }
}

// === Vista de Reportes ===
async function createAdminReportsView() {
  console.log("📊 Creando vista de reportes...")

  return `
    <div class="view admin-view admin-reports-view reports-view hidden">
      <div class="dashboard-header">
        <h1 class="dashboard-title">Reportes y Estadísticas</h1>
        <div class="action-buttons">
          <button class="btn btn-secondary">
            <i class="fas fa-calendar"></i>
            <span>Periodo</span>
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
              <div class="stat-card-title">Categoría Más Popular</div>
              <div class="stat-card-value">Herramientas Eléctricas</div>
            </div>
            <div class="stat-card-icon" style="background-color: #10b981;">
              <i class="fas fa-tools"></i>
            </div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-card-header">
            <div>
              <div class="stat-card-title">Proveedor Más Activo</div>
              <div class="stat-card-value">ToolMaster Inc.</div>
            </div>
            <div class="stat-card-icon" style="background-color: #6366f1;">
              <i class="fas fa-store"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// === Función principal ===
export async function createAdminViews() {
  console.log("🏗️ Creando todas las vistas de administrador...")

  const dashboard = await createAdminDashboardView()
  const users = await createAdminUsersView()
  const tools = await createAdminToolsView()
  const reservations = await createAdminReservationsView()
  const reports = await createAdminReportsView()

  return `${dashboard}${users}${tools}${reservations}${reports}`
}
