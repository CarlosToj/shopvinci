import { useState, useEffect } from 'react';
import { getMisPedidos } from '../services/api';

const estadoColor = { pendiente: '#F08C00', en_proceso: '#2E75B6', enviado: '#6f42c1', entregado: '#28a745' };
const estadoLabel = { pendiente: '⏳ Pendiente', en_proceso: '🔄 En proceso', enviado: '🚚 Enviado', entregado: '✅ Entregado' };

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getMisPedidos()
      .then(res => setPedidos(res.data))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Cargando pedidos...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ color: '#1A3A6B', marginBottom: '24px' }}>Mis Pedidos</h1>
      {pedidos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '12px' }}>
          <div style={{ fontSize: '50px' }}>📦</div>
          <h3 style={{ color: '#666' }}>Aún no tienes pedidos</h3>
        </div>
      ) : pedidos.map(p => (
        <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, color: '#1A3A6B' }}>Orden #{p.id}</h3>
              <p style={{ margin: '4px 0 0', color: '#666', fontSize: '13px' }}>{new Date(p.creado_en).toLocaleDateString('es-GT')}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ backgroundColor: estadoColor[p.estado] + '22', color: estadoColor[p.estado], padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                {estadoLabel[p.estado]}
              </span>
              <p style={{ margin: '8px 0 0', fontWeight: 'bold', color: '#F08C00', fontSize: '18px' }}>Q{parseFloat(p.total).toFixed(2)}</p>
            </div>
          </div>
          <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '13px', color: '#666' }}>
            📍 {p.direccion_envio}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MisPedidos;
