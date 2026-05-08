import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { crearOrden } from '../services/api';

const Checkout = () => {
  const { items, total, vaciar } = useCarrito();
  const navigate = useNavigate();
  const [form, setForm] = useState({ direccion: '', ciudad: '', telefono: '' });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handlePagar = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setCargando(true);
    try {
      const payload = {
        items: items.map(i => ({ producto_id: i.id, cantidad: i.cantidad })),
        direccion_envio: `${form.direccion}, ${form.ciudad}`,
        metodo_pago: 'simulado',
      };
      const res = await crearOrden(payload);
      vaciar();
      alert(`¡Orden #${res.data.orderId} creada exitosamente! Total: Q${res.data.total}`);
      navigate('/mis-pedidos');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar el pago.');
    } finally {
      setCargando(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', marginTop: '6px' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ color: '#1A3A6B', marginBottom: '24px' }}>Finalizar Compra</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Formulario */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: '#1A3A6B', marginTop: 0 }}>Datos de Envío</h3>
          {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}
          <form onSubmit={handlePagar}>
            {[['direccion','Dirección','Zona 1, Calle Principal'],['ciudad','Ciudad','Guatemala City'],['telefono','Teléfono','5000-0000']].map(([f,l,p]) => (
              <div key={f} style={{ marginBottom: '16px' }}>
                <label style={{ color: '#444', fontSize: '14px', fontWeight: '500' }}>{l}</label>
                <input value={form[f]} onChange={e => setForm({...form,[f]:e.target.value})} required placeholder={p} style={inputStyle}/>
              </div>
            ))}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#444', fontSize: '14px', fontWeight: '500' }}>Método de Pago</label>
              <div style={{ marginTop: '10px', padding: '12px', border: '2px solid #F08C00', borderRadius: '8px', backgroundColor: '#fff8ef' }}>
                💳 Pago simulado (demo)
              </div>
            </div>
            <button type="submit" disabled={cargando || items.length === 0}
              style={{ width: '100%', padding: '14px', backgroundColor: '#F08C00', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
              {cargando ? 'Procesando...' : `Pagar Q${total.toFixed(2)}`}
            </button>
          </form>
        </div>
        {/* Resumen */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: '#1A3A6B', marginTop: 0 }}>Resumen del Pedido</h3>
          {items.map(i => (
            <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: '14px' }}>
              <span>{i.nombre} x{i.cantidad}</span>
              <span style={{ fontWeight: '500' }}>Q{(i.precio * i.cantidad).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontWeight: 'bold', fontSize: '18px', color: '#1A3A6B' }}>
            <span>Total</span>
            <span style={{ color: '#F08C00' }}>Q{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
