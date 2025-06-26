import { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Функция для загрузки корзины
  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    setCart(savedCart || []);
  };

  useEffect(() => {
    loadCart();

    const onStorageChange = () => {
      loadCart();
    };

    // Обновление корзины при любом изменении localStorage (вкладка, событие)
    window.addEventListener('storage', onStorageChange);

    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  const addToCart = (product) => {
    const uniqueProduct = { ...product, cartId: `${product.id}-${Date.now()}` };
    const newCart = [...cart, uniqueProduct];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage')); // триггерим обновление вручную
  };

  const removeFromCart = (cartId) => {
    const newCart = cart.filter((p) => p.cartId !== cartId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
