import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado && token) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, [token]);

  const login = (datos, tokenRecibido) => {
    setUsuario(datos);
    setToken(tokenRecibido);
    localStorage.setItem('token', tokenRecibido);
    localStorage.setItem('usuario', JSON.stringify(datos));
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
