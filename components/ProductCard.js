import Link from 'next/link'
import { useContext } from 'react'
import CartContext from '../components/CartContext'
import { getImageForBrand } from '../utils/getImageForBrand.tsx';

const ProductCard = ({ product }) => { const { addToCart } = useContext(CartContext)
  const brand = product.brand || product.characteristics?.find((char) => char.name === "Производитель")?.value;

  return (
    <div className="border border-gray-300 p-3 rounded-lg flex flex-col h-full min-h-[380px] sm:min-h-[320px] shadow-md hover:shadow-2xl hover:border-blue-500 transform hover:scale-105 transition-all duration-300">
      {/* Ссылка и изображение товара */}
      <Link href={`/product/${product._id}`} className="relative block">
        <img
          src={`/images/${product.image}`}
          alt={product.name}
          className="w-full h-32 object-contain mb-2 transition-opacity duration-300 hover:opacity-80"
        />
      </Link>

      {/* Статус наличия */}
      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded self-start mb-2">
        В наличии
      </span>

      {/* Название */}
      <h2 className="text-sm font-semibold mb-1 hover:text-blue-500 transition-colors text-center break-words">
        {product.name}
      </h2>

      {/* Площадь помещения */}
      <div className="text-gray-600 text-xs text-center mb-2">
        {product.characteristics
          ?.filter(char => char.name === 'Площадь помещения, кв.м.')
          .map(char => (
            <span key={char.name} className="font-bold">
              Площадь помещения: {char.value} м²
            </span>
          ))}
      </div>

      {/* Логотип бренда */}
      <img
        src={`/brand/${getImageForBrand(brand || "")}`}
        alt={brand}
        className="w-40 h-20 object-contain mb-2 transition-opacity duration-300 hover:opacity-80 mx-auto"
      />



      {/* Цена и кнопка */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-auto">
        <span className="text-base sm:text-xl font-bold text-gray-900 text-center sm:text-left">
          {product.price} ₽
        </span>
        <button
          className="w-full sm:w-auto bg-blue-500 text-white py-1 px-3 sm:py-2 sm:px-5 text-xs sm:text-sm rounded-lg hover:bg-blue-600 transition-all duration-200"
          onClick={() => addToCart(product)}
        >
          В корзину
        </button>
      </div>
    </div>
  )
}

export default ProductCard
