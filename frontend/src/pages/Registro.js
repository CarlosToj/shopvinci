// ============================================================
// REGISTRO
// ============================================================
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrar } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Registro = () => {
  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '', rol: 'comprador' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const res = await registrar(form);
      login(res.data.usuario, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la cuenta.');
    } finally {
      setCargando(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px' }}>
        <h2 style={{ color: '#1A3A6B', marginBottom: '24px', textAlign: 'center' }}>Crear Cuenta</h2>
        {error && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[['nombre','Nombre completo','text','Juan Pérez'],['correo','Correo electrónico','email','tu@correo.com'],['contrasena','Contraseña','password','••••••••']].map(([field, label, type, placeholder]) => (
            <div key={field} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#444', fontSize: '14px', fontWeight: '500' }}>{label}</label>
              <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                required style={inputStyle} placeholder={placeholder} />
            </div>
          ))}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: '#444', fontSize: '14px', fontWeight: '500' }}>Tipo de cuenta</label>
            <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })} style={inputStyle}>
              <option value="comprador">Comprador</option>
              <option value="comerciante">Comerciante</option>
            </select>
          </div>
          <button type="submit" disabled={cargando} style={{ width: '100%', padding: '12px', backgroundColor: '#F08C00', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
            {cargando ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', color: '#666', fontSize: '14px' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#2E75B6' }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;
