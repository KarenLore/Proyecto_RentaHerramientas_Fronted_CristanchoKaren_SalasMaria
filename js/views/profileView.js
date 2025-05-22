export function profileView() {
  const profileContainer = document.createElement('div');
  profileContainer.className = 'container mx-auto px-4 py-8';

  profileContainer.innerHTML = `
    <h1 class="text-3xl font-bold mb-6">Profile</h1>
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-600">Your profile information will be displayed here.</p>
    </div>
  `;

  return profileContainer;
}