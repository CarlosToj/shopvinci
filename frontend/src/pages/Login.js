import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { iniciarSesion } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ correo: '', contrasena: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const res = await iniciarSesion(form);
      login(res.data.usuario, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)' }}>
      <div style={formCard}>
        <h2 style={{ color: '#1A3A6B', marginBottom: '24px', textAlign: 'center' }}>Iniciar Sesión</h2>
        {error && <div style={errorStyle}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Correo electrónico</label>
            <input type="email" value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })}
              required style={inputStyle} placeholder="tu@correo.com" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Contraseña</label>
            <input type="password" value={form.contrasena} onChange={e => setForm({ ...form, contrasena: e.target.value })}
              required style={inputStyle} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={cargando} style={submitBtn}>
            {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', color: '#666', fontSize: '14px' }}>
          ¿No tienes cuenta? <Link to="/registro" style={{ color: '#2E75B6' }}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

const formCard = { backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' };
const fieldStyle = { marginBottom: '16px' };
const labelStyle = { display: 'block', marginBottom: '6px', color: '#444', fontSize: '14px', fontWeight: '500' };
const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' };
const submitBtn = { width: '100%', padding: '12px', backgroundColor: '#1A3A6B', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' };
const errorStyle = { backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' };

export default Login;
