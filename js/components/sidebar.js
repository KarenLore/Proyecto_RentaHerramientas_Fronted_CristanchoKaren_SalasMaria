/**
 * Componente de Sidebar
 */

export function createSidebar(currentRole) {
  const menuItems = getMenuItemsByRole(currentRole)

  return `
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-title">Navegación</div>
        <div class="role-selector">
          <select id="roleSelector">
            <option value="admin" ${currentRole === "admin" ? "selected" : ""}>Administrador</option>
            <option value="provider" ${currentRole === "provider" ? "selected" : ""}>Proveedor</option>
            <option value="client" ${currentRole === "client" ? "selected" : ""}>Cliente</option>
          </select>
        </div>
      </div>
      <ul class="nav-menu">
        ${menuItems
          .map(
            (item, index) => `
          <li class="nav-item ${index === 0 ? "active" : ""}" data-view="${item.view}">
            <i class="${item.icon}"></i>
            <span>${item.label}</span>
          </li>
        `,
          )
          .join("")}
        <li class="nav-item" id="logoutBtn">
          <i class="fas fa-sign-out-alt"></i>
          <span>Cerrar Sesión</span>
        </li>
      </ul>
    </div>
  `
}

function getMenuItemsByRole(role) {
  const menus = {
    admin: [
      { label: "Dashboard", icon: "fas fa-tachometer-alt", view: "admin-dashboard" },
      { label: "Usuarios", icon: "fas fa-users", view: "admin-users" },
      { label: "Reservas", icon: "fas fa-clipboard-list", view: "admin-reservations" },
      { label: "Reportes", icon: "fas fa-chart-bar", view: "admin-reports" },
    ],
    provider: [
      { label: "Dashboard", icon: "fas fa-tachometer-alt", view: "provider-dashboard" },
      { label: "Mis Herramientas", icon: "fas fa-tools", view: "provider-tools" },
      { label: "Reservas", icon: "fas fa-clipboard-list", view: "provider-reservations" },
      { label: "Facturación", icon: "fas fa-file-invoice-dollar", view: "provider-billing" },
    ],
    client: [
      { label: "Dashboard", icon: "fas fa-tachometer-alt", view: "client-dashboard" },
      { label: "Explorar", icon: "fas fa-search", view: "client-explore" },
      { label: "Mis Reservas", icon: "fas fa-clipboard-list", view: "client-reservations" },
      { label: "Mis Pagos", icon: "fas fa-credit-card", view: "client-payments" },
    ],
  }

  return menus[role] || menus.client
}
