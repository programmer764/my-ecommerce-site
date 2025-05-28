import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { label: 'Настенные кондиционеры', icon: '/icons/l1.svg' },
  { label: 'Мульти сплит-системы', icon: '/icons/l2.svg' },
  { label: 'Канальные кондиционеры', icon: '/icons/l3.svg' },
  { label: 'Кассетные кондиционеры', icon: '/icons/l4.svg' },
  { label: 'Мобильные кондиционеры', icon: '/icons/l5.svg' },
  { label: 'Напольно-потолочные', icon: '/icons/l6.svg' },
  { label: 'Мультизональные VRF', icon: '/icons/l7.svg' },
  { label: 'Фанкойлы', icon: '/icons/l8.svg' },
  { label: 'Колонные кондиционеры', icon: '/icons/l9.svg' },
  { label: 'Тепловые насосы', icon: '/icons/l10.svg' },
  { label: 'Оконные кондиционеры', icon: '/icons/l11.svg' },
  { label: 'Холодильные системы', icon: '/icons/l12.svg' },
]
const HeaderTiles = () => {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Логотип в верхней части */}
        <div className="flex items-center justify-center mb-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/icons/logo2.svg" alt="Логотип" width={200} height={100} />
            <span className="text-2xl font-bold text-gray-800">ClimaTrade</span>
          </Link>
        </div>

        {/* Плиточная навигация */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          <Link href="/panel1" className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-3 shadow hover:bg-blue-100 transition cursor-pointer">
            <Image src="/icons/l1.svg" alt="Кондиционеры" width={40} height={40} className="mb-2" />
            <span className="text-sm font-medium text-gray-700">Кондиционеры</span>
          </Link>

          <Link href="/panel2" className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-3 shadow hover:bg-blue-100 transition cursor-pointer">
            <Image src="/icons/l2.svg" alt="Радиаторы" width={40} height={40} className="mb-2" />
            <span className="text-sm font-medium text-gray-700">Радиаторы</span>
          </Link>

          <Link href="/panel3" className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-3 shadow hover:bg-blue-100 transition cursor-pointer">
            <Image src="/icons/l5.svg" alt="Микроклимат" width={40} height={40} className="mb-2" />
            <span className="text-sm font-medium text-gray-700">Микроклимат</span>
          </Link>

          <Link href="/panel4" className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-3 shadow hover:bg-blue-100 transition cursor-pointer">
            <Image src="/icons/l4.svg" alt="Вентиляция" width={40} height={40} className="mb-2" />
            <span className="text-sm font-medium text-gray-700">Вентиляция</span>
          </Link>
          <Link href="/panel4" className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-3 shadow hover:bg-blue-100 transition cursor-pointer">
            <Image src="/icons/l5.svg" alt="Вентиляция" width={40} height={40} className="mb-2" />
            <span className="text-sm font-medium text-gray-700">Осушители</span>
          </Link>
          <Link href="/panel4" className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-3 shadow hover:bg-blue-100 transition cursor-pointer">
            <Image src="/icons/l6.svg" alt="Вентиляция" width={40} height={40} className="mb-2" />
            <span className="text-sm font-medium text-gray-700">Обогреватели</span>
          </Link>

          {/* Можно добавить ещё плитки по аналогии */}
        </div>
      </div>
    </header>
  );
};

export default HeaderTiles;
