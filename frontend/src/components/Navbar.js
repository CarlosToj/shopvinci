import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const { totalItems } = useCarrito();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: '#1A3A6B', padding: '0 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '64px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
    }}>
      {/* Logo */}
      <Link to="/" style={{ color: '#fff', fontWeight: 'bold', fontSize: '22px', textDecoration: 'none' }}>
        🛒 ShopVinci
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link to="/" style={linkStyle}>Catálogo</Link>

        {usuario?.rol === 'comerciante' && (
          <Link to="/panel" style={linkStyle}>Mi Panel</Link>
        )}

        {usuario ? (
          <>
            <Link to="/mis-pedidos" style={linkStyle}>Mis Pedidos</Link>
            <span style={{ color: '#ccc', fontSize: '14px' }}>Hola, {usuario.nombre.split(' ')[0]}</span>
            <button onClick={handleLogout} style={btnStyle}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Iniciar sesión</Link>
            <Link to="/registro" style={{ ...btnStyle, textDecoration: 'none' }}>Registrarse</Link>
          </>
        )}

        {/* Carrito */}
        <Link to="/carrito" style={{ color: '#fff', textDecoration: 'none', position: 'relative' }}>
          🛒
          {totalItems > 0 && (
            <span style={{
              position: 'absolute', top: '-8px', right: '-8px',
              backgroundColor: '#F08C00', color: '#fff',
              borderRadius: '50%', width: '18px', height: '18px',
              fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

const linkStyle = { color: '#ccc', textDecoration: 'none', fontSize: '14px' };
const btnStyle = {
  backgroundColor: '#F08C00', color: '#fff', border: 'none',
  padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
};

export default Navbar;
