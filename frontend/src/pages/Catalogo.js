import { useState, useEffect } from 'react';
import { getProductos } from '../services/api';
import { useCarrito } from '../context/CarritoContext';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const { agregar } = useCarrito();

  useEffect(() => {
    cargarProductos();
  }, [pagina]);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const res = await getProductos({ page: pagina, limit: 8 });
      setProductos(res.data.productos);
      setTotalPaginas(res.data.paginas);
    } catch {
      setMensaje('Error al cargar productos.');
    } finally {
      setCargando(false);
    }
  };

  const handleAgregar = (producto) => {
    agregar(producto);
    setMensaje(`"${producto.nombre}" agregado al carrito ✓`);
    setTimeout(() => setMensaje(''), 2500);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ color: '#1A3A6B', marginBottom: '8px' }}>Catálogo de Productos</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>Encuentra todo lo que necesitas en un solo lugar</p>

      {mensaje && (
        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          {mensaje}
        </div>
      )}

      {cargando ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Cargando productos...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {productos.map(p => (
              <div key={p.id} style={cardStyle}>
                <div style={{ backgroundColor: '#e8eef5', height: '160px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '40px' }}>
                  🛍️
                </div>
                <h3 style={{ color: '#1A3A6B', margin: '0 0 6px', fontSize: '15px' }}>{p.nombre}</h3>
                <p style={{ color: '#666', fontSize: '13px', margin: '0 0 8px', minHeight: '36px' }}>{p.descripcion?.slice(0, 60)}...</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#1A3A6B', fontWeight: 'bold', fontSize: '16px' }}>Q{parseFloat(p.precio).toFixed(2)}</span>
                  <span style={{ color: p.stock > 0 ? '#28a745' : '#dc3545', fontSize: '12px' }}>
                    {p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}
                  </span>
                </div>
                <button
                  onClick={() => handleAgregar(p)}
                  disabled={p.stock === 0}
                  style={{
                    marginTop: '12px', width: '100%', padding: '8px',
                    backgroundColor: p.stock > 0 ? '#F08C00' : '#ccc',
                    color: '#fff', border: 'none', borderRadius: '8px',
                    cursor: p.stock > 0 ? 'pointer' : 'not-allowed', fontSize: '14px', fontWeight: 'bold'
                  }}>
                  {p.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                </button>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
            <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1} style={paginaBtnStyle}>← Anterior</button>
            <span style={{ padding: '8px 16px', color: '#666' }}>Página {pagina} de {totalPaginas}</span>
            <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} style={paginaBtnStyle}>Siguiente →</button>
          </div>
        </>
      )}
    </div>
  );
};

const cardStyle = {
  backgroundColor: '#fff', borderRadius: '12px', padding: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s',
};
const paginaBtnStyle = {
  padding: '8px 16px', backgroundColor: '#1A3A6B', color: '#fff',
  border: 'none', borderRadius: '8px', cursor: 'pointer',
};

export default Catalogo;
