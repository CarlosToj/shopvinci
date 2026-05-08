import { useCarrito } from '../context/CarritoContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Carrito = () => {
  const { items, eliminar, cambiarCantidad, total, vaciar } = useCarrito();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!usuario) return navigate('/login');
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '700px', margin: '40px auto', padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>🛒</div>
        <h2 style={{ color: '#1A3A6B' }}>Tu carrito está vacío</h2>
        <p style={{ color: '#666' }}>Agrega productos desde el catálogo para empezar</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '16px', padding: '10px 24px', backgroundColor: '#1A3A6B', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Ir al catálogo
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ color: '#1A3A6B', marginBottom: '24px' }}>Mi Carrito ({items.length} productos)</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map(item => (
          <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: '#e8eef5', width: '60px', height: '60px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>🛍️</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, color: '#1A3A6B' }}>{item.nombre}</h4>
              <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>Q{parseFloat(item.precio).toFixed(2)} c/u</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => cambiarCantidad(item.id, item.cantidad - 1)} style={cantBtn}>-</button>
              <span style={{ minWidth: '24px', textAlign: 'center' }}>{item.cantidad}</span>
              <button onClick={() => cambiarCantidad(item.id, item.cantidad + 1)} style={cantBtn}>+</button>
            </div>
            <span style={{ fontWeight: 'bold', color: '#1A3A6B', minWidth: '80px', textAlign: 'right' }}>
              Q{(item.precio * item.cantidad).toFixed(2)}
            </span>
            <button onClick={() => eliminar(item.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', marginTop: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1A3A6B' }}>Total</span>
          <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#F08C00' }}>Q{total.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={vaciar} style={{ flex: 1, padding: '12px', backgroundColor: '#fff', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '8px', cursor: 'pointer' }}>
            Vaciar carrito
          </button>
          <button onClick={handleCheckout} style={{ flex: 2, padding: '12px', backgroundColor: '#F08C00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
            Proceder al pago →
          </button>
        </div>
      </div>
    </div>
  );
};

const cantBtn = { width: '28px', height: '28px', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#fff', fontWeight: 'bold' };

export default Carrito;
