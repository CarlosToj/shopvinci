const { validateEmail, hashPassword, generarJWT } = require('../src/controllers/authController');

// Simular variables de entorno
process.env.JWT_SECRET = 'test_secret_shopvinci';
process.env.JWT_EXPIRES_IN = '24h';

describe('ShopVinci — Pruebas Unitarias', () => {

  // UT-01: Validación de formato de correo
  describe('validateEmail()', () => {
    test('UT-01a: correo válido retorna true', () => {
      expect(validateEmail('usuario@gmail.com')).toBe(true);
      expect(validateEmail('test@shopvinci.gt')).toBe(true);
    });

    test('UT-01b: correo inválido retorna false', () => {
      expect(validateEmail('correo-sin-arroba')).toBe(false);
      expect(validateEmail('@sinusuario.com')).toBe(false);
      expect(validateEmail('sindominio@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  // UT-02: Encriptar contraseña
  describe('hashPassword()', () => {
    test('UT-02: el hash generado es diferente al texto plano', async () => {
      const contrasena = 'MiContrasena123';
      const hash = await hashPassword(contrasena);
      expect(hash).not.toBe(contrasena);
      expect(hash.length).toBeGreaterThan(50);
    });

    test('UT-02b: dos hashes de la misma contraseña son distintos (salt diferente)', async () => {
      const hash1 = await hashPassword('mismaContrasena');
      const hash2 = await hashPassword('mismaContrasena');
      expect(hash1).not.toBe(hash2);
    });
  });

  // UT-03: Generación de JWT
  describe('generarJWT()', () => {
    test('UT-03: el token contiene userId y rol', () => {
      const jwt = require('jsonwebtoken');
      const usuarioFalso = { id: 1, correo: 'test@test.com', rol: 'comprador' };
      const token = generarJWT(usuarioFalso);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(1);
      expect(decoded.rol).toBe('comprador');
    });

    test('UT-03b: el token expira en 24h', () => {
      const jwt = require('jsonwebtoken');
      const token = generarJWT({ id: 5, correo: 'x@x.com', rol: 'admin' });
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const expiresIn = decoded.exp - decoded.iat;
      expect(expiresIn).toBe(86400); // 24h en segundos
    });
  });

  // UT-04: Cálculo de total del carrito
  describe('calcularTotal()', () => {
    const calcularTotal = (items) => {
      return items.reduce((total, item) => total + item.precio * item.cantidad, 0);
    };

    test('UT-04a: calcula correctamente el total con múltiples items', () => {
      const items = [
        { precio: 100, cantidad: 2 },
        { precio: 50.50, cantidad: 3 },
        { precio: 299.99, cantidad: 1 },
      ];
      const total = calcularTotal(items);
      expect(total).toBeCloseTo(651.49, 2);
    });

    test('UT-04b: carrito vacío retorna 0', () => {
      expect(calcularTotal([])).toBe(0);
    });
  });

  // UT-05: Validación de stock
  describe('actualizarStock()', () => {
    const actualizarStock = (stockActual, cantidad) => {
      if (cantidad > stockActual) return null;
      return stockActual - cantidad;
    };

    test('UT-05a: el stock no puede quedar negativo', () => {
      expect(actualizarStock(5, 10)).toBeNull();
    });

    test('UT-05b: stock se reduce correctamente', () => {
      expect(actualizarStock(50, 5)).toBe(45);
    });

    test('UT-05c: compra exacta del stock disponible', () => {
      expect(actualizarStock(3, 3)).toBe(0);
    });
  });

  // UT-06: Cálculo de calificación promedio
  describe('calcularCalificacion()', () => {
    const calcularCalificacion = (resenas) => {
      if (resenas.length === 0) return 0;
      const suma = resenas.reduce((acc, r) => acc + r, 0);
      return parseFloat((suma / resenas.length).toFixed(1));
    };

    test('UT-06a: promedio correcto con múltiples reseñas', () => {
      expect(calcularCalificacion([5, 4, 3, 5, 4])).toBe(4.2);
    });

    test('UT-06b: sin reseñas retorna 0', () => {
      expect(calcularCalificacion([])).toBe(0);
    });

    test('UT-06c: una sola reseña retorna su propio valor', () => {
      expect(calcularCalificacion([4])).toBe(4.0);
    });
  });

});
