// URL de la API
export const API_URL = 'http://localhost:8080';

// Categorías de herramientas con iconos
export const TOOL_CATEGORIES = [
  { id: 1, name: 'Herramientas Eléctricas', icon: 'bi-tools' },
  { id: 2, name: 'Herramientas Manuales', icon: 'bi-wrench' },
  { id: 3, name: 'Instrumentos de Medición', icon: 'bi-rulers' },
  { id: 4, name: 'Herramientas de Jardín', icon: 'bi-flower1' },
  { id: 5, name: 'Escaleras y Andamios', icon: 'bi-ladder' },
  { id: 6, name: 'Herramientas de Plomería', icon: 'bi-water' },
  { id: 7, name: 'Herramientas Eléctricas', icon: 'bi-lightning' },
  { id: 8, name: 'Herramientas Automotrices', icon: 'bi-car-front' },
  { id: 9, name: 'Equipos de Limpieza', icon: 'bi-bucket' }
];

// Estados de reserva
export const RESERVATION_STATUSES = {
  PENDING: { label: 'Pendiente', color: 'warning' },
  APPROVED: { label: 'Aprobado', color: 'success' },
  REJECTED: { label: 'Rechazado', color: 'error' },
  COMPLETED: { label: 'Completado', color: 'secondary' },
  CANCELLED: { label: 'Cancelado', color: 'gray' }
};

// Imágenes de herramientas
export const TOOL_IMAGES = {
  'power-drill': 'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'circular-saw': 'https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'lawn-mower': 'https://images.pexels.com/photos/589/garden-grass-meadow-green.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'hammer': 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'ladder': 'https://images.pexels.com/photos/257636/pexels-photo-257636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'pressure-washer': 'https://images.pexels.com/photos/5935755/pexels-photo-5935755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'default': 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
};

// Métodos de pago
export const PAYMENT_METHODS = [
  { id: 'credit_card', name: 'Tarjeta de Crédito' },
  { id: 'debit_card', name: 'Tarjeta de Débito' },
  { id: 'paypal', name: 'PayPal' },
  { id: 'bank_transfer', name: 'Transferencia Bancaria' }
];

// Configuración del sitio
export const SITE_CONFIG = {
  name: 'RentaTools',
  description: 'Tu plataforma confiable para el alquiler de herramientas',
  contact: {
    email: 'info@rentatools.com',
    phone: '+52 (555) 123-4567',
    address: 'Av. Herramientas 123, Ciudad Constructor, CP 12345'
  },
  social: {
    facebook: 'https://facebook.com/rentatools',
    twitter: 'https://twitter.com/rentatools',
    instagram: 'https://instagram.com/rentatools'
  }
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  SUPPLIER: 'PROVEEDOR',
  CLIENT: 'CLIENTE'
};

// Usuario administrador predeterminado
export const DEFAULT_ADMIN = {
  email: 'admin@rentatools.com',
  password: 'admin123'
};