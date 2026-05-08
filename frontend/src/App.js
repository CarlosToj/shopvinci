import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';
import Navbar from './components/Navbar';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import MisPedidos from './pages/MisPedidos';
import PanelComerciante from './pages/PanelComerciante';

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <Router>
          <Navbar />
          <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', paddingTop: '70px' }}>
            <Routes>
              <Route path="/" element={<Catalogo />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/mis-pedidos" element={<MisPedidos />} />
              <Route path="/panel" element={<PanelComerciante />} />
            </Routes>
          </div>
        </Router>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
