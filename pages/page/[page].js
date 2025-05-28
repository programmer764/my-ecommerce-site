import axios from 'axios';
import { useState, useEffect } from 'react';
import Link from 'next/link'; // Импортируем Link для навигации между страницами

// Функция для загрузки данных о товарах на сервере
export async function getServerSideProps({ query }) {
  const page = query.page || 1; // Получаем текущую страницу из URL
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${page}`); // Запрос с параметром пагинации
  const { products, totalCount } = response.data;

  return {
    props: {
      products, // Передаем данные о продуктах в компонент
      totalCount, // Передаем общее количество товаров
    },
  };
}

const Home = ({ products, totalCount, addToCart, cart }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Количество товаров на странице

  // Рассчитываем количество страниц
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Используем маршрутизацию Next.js с Link вместо window.location.href
    window.history.pushState(null, '', `/page/${page}`); // Для изменения URL без перезагрузки страницы
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mb-6 text-center">Наши товары</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Корзина</h2>
        <p>В корзине {cart.length} товаров</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Link href={`/product/${product._id}`}> {/* Переход на страницу товара по его _id */}
              
                <img 
                   src={`/${product.localImage}`}  // Используем localImage из MongoDB
                  alt={product.name} 
                  className="w-full h-40 object-contain mb-4 cursor-pointer" 
                />
              
            </Link>
            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
            <button
              className="mt-auto bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-200"
              onClick={() => addToCart(product)}
            >
              Добавить в корзину
            </button>
          </div>
        ))}
      </div>

      {/* Кнопки для навигации между страницами */}
      <div className="flex justify-center mt-6">
        <Link href={`/page/${currentPage - 1}`} passHref>
          <button
            disabled={currentPage <= 1}
            className="px-4 py-2 bg-gray-300 text-black rounded-l disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Назад
          </button>
        </Link>
        
        <span className="px-4 py-2 text-lg">{currentPage} из {totalPages}</span>
        
        <Link href={`/page/${currentPage + 1}`} passHref>
          <button
            disabled={currentPage >= totalPages}
            className="px-4 py-2 bg-gray-300 text-black rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Вперед
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
