export function adminPanelView() {
  const container = document.createElement('div');
  container.className = 'admin-panel container mx-auto p-4';
  
  container.innerHTML = `
    <h1 class="text-2xl font-bold mb-4">Admin Panel</h1>
    <div class="bg-white rounded-lg shadow p-6">
      <p>Welcome to the admin panel. This area is restricted to administrators only.</p>
    </div>
  `;
  
  return container;
}