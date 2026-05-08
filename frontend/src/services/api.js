import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Agregar token JWT a cada request automáticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registrar = (datos) => api.post('/auth/register', datos);
export const iniciarSesion = (datos) => api.post('/auth/login', datos);

// Productos
export const getProductos = (params) => api.get('/products', { params });
export const getProducto = (id) => api.get(`/products/${id}`);
export const crearProducto = (datos) => api.post('/products', datos);
export const actualizarProducto = (id, datos) => api.put(`/products/${id}`, datos);
export const eliminarProducto = (id) => api.delete(`/products/${id}`);

// Órdenes
export const crearOrden = (datos) => api.post('/orders', datos);
export const getMisPedidos = () => api.get('/orders/mis-pedidos');

export default api;
