import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const removeFromCart = (cartId) => {
    const newCart = cart.filter((product) => product.cartId !== cartId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const increaseQuantity = (cartId) => {
    const newCart = cart.map((product) => {
      if (product.cartId === cartId) {
        return { ...product, quantity: (product.quantity || 1) + 1 };
      }
      return product;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const decreaseQuantity = (cartId) => {
    const newCart = cart.map((product) => {
      if (product.cartId === cartId && product.quantity > 1) {
        return { ...product, quantity: product.quantity - 1 };
      }
      return product;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, product) => {
      const qty = product.quantity || 1;
      return total + product.price * qty;
    }, 0);
  };

  const goToCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Корзина</h1>

        {cart.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600 mb-4">Ваша корзина пуста.</p>
            <Link href="/" className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
              Вернуться на главную
            </Link>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {cart.map((product) => (
                <li key={product.cartId} className="flex items-center justify-between py-4">
                  <Image
                    src={`/images/${product.image}`}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="rounded object-contain"
                  />
                  <div className="flex-1 ml-4">
                    <p className="font-medium text-lg">{product.name}</p>
                    <p className="text-gray-500">{product.price}₽ / шт.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => decreaseQuantity(product.cartId)} className="bg-gray-200 px-2 py-1 rounded">–</button>
                    <span>{product.quantity || 1}</span>
                    <button onClick={() => increaseQuantity(product.cartId)} className="bg-gray-200 px-2 py-1 rounded">+</button>
                  </div>
                  <button onClick={() => removeFromCart(product.cartId)} className="bg-red-500 text-white px-3 py-1 rounded ml-4">Удалить</button>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-xl font-semibold">
                Итого: <span className="text-blue-600">{getTotalPrice()}₽</span>
              </p>
              <button
                onClick={goToCheckout}
                className="mt-4 sm:mt-0 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded shadow"
              >
                Перейти к оформлению
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
