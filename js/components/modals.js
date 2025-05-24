/**
 * Componentes de Modales
 */

export function createAddToolModal() {
  return `
    <div class="modal-overlay" id="addToolModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Agregar Nueva Herramienta</div>
          <button class="modal-close" id="closeToolModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form id="addToolForm" class="form-container">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Nombre de la Herramienta</label>
                <input type="text" class="form-control" name="name" required>
              </div>
              <div class="form-group">
                <label class="form-label">Marca</label>
                <input type="text" class="form-control" name="brand" required>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Modelo</label>
                <input type="text" class="form-control" name="model" required>
              </div>
              <div class="form-group">
                <label class="form-label">Categoría</label>
                <select class="form-control" name="category" required>
                  <option value="">Seleccionar categoría</option>
                  <option value="Herramientas Eléctricas">Herramientas Eléctricas</option>
                  <option value="Herramientas Manuales">Herramientas Manuales</option>
                  <option value="Maquinaria Pesada">Maquinaria Pesada</option>
                  <option value="Equipos de Seguridad">Equipos de Seguridad</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Precio por Día ($)</label>
                <input type="number" class="form-control" name="costPerDay" step="0.01" min="0" required>
              </div>
              <div class="form-group">
                <label class="form-label">Cantidad Disponible</label>
                <input type="number" class="form-control" name="availableQuantity" min="1" required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Descripción</label>
              <textarea class="form-control" name="description" rows="4" placeholder="Describe las características y especificaciones de la herramienta..."></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">
                <input type="checkbox" name="active" checked> 
                Herramienta activa
              </label>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancelToolBtn">Cancelar</button>
          <button class="btn btn-primary" id="saveToolBtn">
            <i class="fas fa-save"></i>
            Guardar Herramienta
          </button>
        </div>
      </div>
    </div>
  `
}

export function createReservationModal() {
  return `
    <div class="modal-overlay" id="reservationModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Realizar Reserva</div>
          <button class="modal-close" id="closeReservationModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form id="reservationForm" class="form-container">
            <div class="form-group">
              <label class="form-label">Herramienta Seleccionada</label>
              <input type="text" class="form-control" id="selectedTool" readonly>
              <input type="hidden" id="selectedToolId">
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Fecha de Inicio</label>
                <input type="date" class="form-control" name="startDate" required>
              </div>
              <div class="form-group">
                <label class="form-label">Fecha de Fin</label>
                <input type="date" class="form-control" name="endDate" required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Notas Adicionales</label>
              <textarea class="form-control" name="notes" rows="3" placeholder="Información adicional sobre el uso previsto..."></textarea>
            </div>
            
            <div class="form-group">
              <div class="cost-summary">
                <div class="cost-item">
                  <span>Días de alquiler:</span>
                  <span id="rentalDays">0</span>
                </div>
                <div class="cost-item">
                  <span>Precio por día:</span>
                  <span id="dailyRate">$0.00</span>
                </div>
                <div class="cost-item total">
                  <span>Total estimado:</span>
                  <span id="totalCost">$0.00</span>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancelReservationBtn">Cancelar</button>
          <button class="btn btn-primary" id="confirmReservationBtn">
            <i class="fas fa-check"></i>
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  `
}

// Add modal styles
const modalStyles = `
  .cost-summary {
    background: var(--light);
    border-radius: var(--border-radius-sm);
    padding: 1rem;
    margin-top: 1rem;
  }
  
  .cost-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  
  .cost-item.total {
    border-top: 1px solid var(--gray-light);
    padding-top: 0.5rem;
    margin-top: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
  }
`

// Inject styles
const style = document.createElement("style")
style.textContent = modalStyles
document.head.appendChild(style)
