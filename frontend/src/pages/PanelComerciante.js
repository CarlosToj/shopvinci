import { useState, useEffect } from 'react';
import { getProductos, crearProducto, eliminarProducto } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PanelComerciante = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '', categoria_id: 1 });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!usuario || usuario.rol !== 'comerciante') { navigate('/'); return; }
    cargarProductos();
  }, [usuario]);

  const cargarProductos = async () => {
    try {
      const res = await getProductos({ limit: 50 });
      setProductos(res.data.productos);
    } catch {}
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setError(''); setMensaje('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      await crearProducto(formData);
      setMensaje('Producto creado exitosamente ✓');
      setForm({ nombre: '', descripcion: '', precio: '', stock: '', categoria_id: 1 });
      cargarProductos();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear producto.');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try { await eliminarProducto(id); cargarProductos(); } catch {}
  };

  const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box', marginTop: '4px' };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ color: '#1A3A6B', marginBottom: '8px' }}>Panel del Comerciante</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>Gestiona tus productos y revisa tus ventas</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Formulario nuevo producto */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', height: 'fit-content' }}>
          <h3 style={{ color: '#1A3A6B', marginTop: 0 }}>Nuevo Producto</h3>
          {mensaje && <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '8px', borderRadius: '6px', marginBottom: '12px', fontSize: '13px' }}>{mensaje}</div>}
          {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '8px', borderRadius: '6px', marginBottom: '12px', fontSize: '13px' }}>{error}</div>}
          <form onSubmit={handleCrear}>
            {[['nombre','Nombre','text'],['precio','Precio (Q)','number'],['stock','Stock','number'],['descripcion','Descripción','text']].map(([f,l,t]) => (
              <div key={f} style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', color: '#444', fontWeight: '500' }}>{l}</label>
                <input type={t} value={form[f]} onChange={e => setForm({...form,[f]:e.target.value})} required style={inputStyle}/>
              </div>
            ))}
            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#F08C00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              + Agregar Producto
            </button>
          </form>
        </div>

        {/* Lista de productos */}
        <div>
          <h3 style={{ color: '#1A3A6B' }}>Mis Productos ({productos.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {productos.map(p => (
              <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '14px 16px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#1A3A6B', fontSize: '14px' }}>{p.nombre}</h4>
                  <p style={{ margin: '2px 0 0', color: '#666', fontSize: '12px' }}>Q{parseFloat(p.precio).toFixed(2)} — Stock: {p.stock}</p>
                </div>
                <button onClick={() => handleEliminar(p.id)} style={{ backgroundColor: '#fff', border: '1px solid #dc3545', color: '#dc3545', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                  Eliminar
                </button>
              </div>
            ))}
            {productos.length === 0 && <p style={{ color: '#666', textAlign: 'center' }}>Aún no tienes productos registrados</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelComerciante;
