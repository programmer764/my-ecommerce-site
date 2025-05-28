// components/Cart.js
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import CartContext from '../components/CartContext';

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Функция расчета общей стоимости
  const getTotalPrice = () =>
    cart.reduce((total, product) => total + product.price, 0);

  return (
    <>
      {/* Кнопка корзины: фиксирована в верхнем правом углу с градиентом и иконкой */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4  bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-3 rounded-3xl shadow hover:shadow-xl flex items-center justify-center text-base transition-all duration-300 z-10"
      >
        {/* Иконка корзины (SVG) */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-6-9v9"
          />
        </svg>
        <span className="font-medium">Корзина</span>
        {/* Баллун с количеством товаров */}
        {cart.length > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {cart.length}
          </span>
        )}
      </button>

      {/* Модальное окно корзины */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)} // Клик по затемненному фону закрывает окно
        >
          <div
            className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()} // Чтобы клик внутри окна не закрывал его
          >
            {/* Кнопка закрытия */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold mb-4 text-center">Ваша Корзина</h3>

            {cart.length === 0 ? (
              <p className="text-center text-gray-600">В корзине нет товаров</p>
            ) : (
              <>
                <ul className="space-y-4 max-h-80 overflow-y-auto">
                  {cart.map((product) => (
                    <li
                      key={product.cartId}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.price} ₽</p>
                      </div>
                      <button
                        className="text-red-500 hover:underline text-sm"
                        onClick={() => removeFromCart(product.cartId)}
                      >
                        Удалить
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xl font-semibold text-right">
                  Итого: {getTotalPrice()} ₽
                </p>
                <button
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white w-full py-3 mt-6 rounded-lg shadow-md transition-all duration-300"
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/cart'); // Переход на страницу корзины
                  }}
                >
                  Перейти к оформлению
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
