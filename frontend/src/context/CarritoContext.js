import { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext(null);

export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const guardado = localStorage.getItem('carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);

  const agregar = (producto, cantidad = 1) => {
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id);
      if (existe) {
        return prev.map(i => i.id === producto.id
          ? { ...i, cantidad: i.cantidad + cantidad }
          : i
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const eliminar = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad <= 0) return eliminar(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i));
  };

  const vaciar = () => setItems([]);

  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ items, agregar, eliminar, cambiarCantidad, vaciar, total, totalItems }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);
