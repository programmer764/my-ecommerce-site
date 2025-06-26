// pages/index.js
import { useState, useEffect } from 'react'
import axios from 'axios'
import clientPromise from '@/lib/mongo'
import ProductCard from '@/components/ProductCard'
import ProductFilter from '@/components/ProductFilter'
import Pagination from '@/components/Pagination'
import FilterButton from '@/components/FilterButton'
import BannerSlider from '@/components/BannerSlider'
import EquipmentPickerForm from '@/components/EquipmentPickerForm'
import InfoBanner from '@/components/InfoBanner'
import BrandGallery from '@/components/BrandGallery'
import ServiceBlocks from '@/components/ServiceBlocks'
import ConditionerReviews from '@/components/ConditionerReviews'
import ClimatePromoSection from '@/components/ClimatePromoSection'
export async function getServerSideProps({ query }) {
  // 1) Получаем товары + общее число
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
    { params: query }
  )
  const { products, totalCount } = data
  fetch('/api/csrf', { credentials: 'include' })
  // 2) Собираем бренды и страны из ВСЕХ товаров
  const client = await clientPromise
  const coll = client.db('dbcom').collection('dbcom2')

  const docsB = await coll
    .find({ 'characteristics.name': 'Производитель' })
    .project({ characteristics: 1 })
    .toArray()
  const availableBrands = Array.from(new Set(
    docsB
      .map(d => d.characteristics.find(c => c.name === 'Производитель')?.value)
      .filter(Boolean)
  ))

  const docsC = await coll
    .find({ 'characteristics.name': 'Страна бренда' })
    .project({ characteristics: 1 })
    .toArray()
  const availableCountries = Array.from(new Set(
    docsC
      .map(d => d.characteristics.find(c => c.name === 'Страна бренда')?.value)
      .filter(Boolean)
  ))

  return {
    props: {
      products,
      totalCount,
      currentPage: parseInt(query.page || '1', 10),
      availableBrands,
      availableCountries
    }
  }
}

export default function Home({
  products,
  totalCount,
  currentPage,
  availableBrands,
  availableCountries
}) {
  const [showFilter, setShowFilter] = useState(false)
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])

  const totalPages = Math.ceil(totalCount / 15)

  return (


    <div className="  flex flex-col lg:flex-row gap-4 ">


      {/* мобильная кнопка */}
      <div className="mb-2 lg:hidden">
        <FilterButton
          showFilter={showFilter}
          toggleFilter={() => setShowFilter(!showFilter)}
        />
      </div>

      {/* фильтр */}



      {/* товары */}

      <main className="flex-1 min-w-0">

        <nav className="  text-sm ">

          <ul className="flex  flex-wrap justify-center items-center gap-4   bg-gradient-to-r from-blue-200 to-gray-300 text-lg font-medium pt-3 pb-3">
            {[
              { href: "#about", label: "О компании" },
              { href: "#payment", label: "Оплата и доставка" },
              { href: "#guarantee", label: "Гарантия" },
              { href: "#projects", label: "Наши работы" },
              { href: "#installation", label: "Монтаж и согласование" },
              { href: "#contact", label: "Контакты" },
            ].map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.href}
                  className="px-4 py-2 text-black hover:text-blue-900 transition-colors duration-200"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <hr className="border-t-2 border-black w-full mb-4" />

        </nav>
        <>
         <div className="flex flex-col md:flex-row mb-[50px] justify-center gap-6 max-w-7xl mx-auto px-4 min-h-[600px] md:h-[600px]">
  {/* Левая колонка */}
  <div className="flex-[2] flex flex-col  min-w-0">
    <div className="flex-[2] bg-white rounded-3xl shadow overflow-hidden min-h-[300px]">
      <BannerSlider />
    </div>
    <div className="flex-[1] bg-white rounded-3xl shadow overflow-hidden min-h-[150px]">
      <InfoBanner />
    </div>
  </div>

  {/* Правая колонка */}
  <div className="flex-[1] min-w-0">
    <div className="w-full bg-white shadow rounded-3xl overflow-hidden min-h-[450px] mt-6 md:mt-0 h-full">
      <EquipmentPickerForm />
    </div>
  </div>
</div>




          <div className="text-black bg-white font-sans">           
           <section className="bg-white py-24 px-6">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">

    {/* Левый текстовый блок */}
    <div className="md:col-span-5 flex flex-col justify-start text-left mt-64">
      <h2 className="text-4xl font-bold leading-snug mb-4">
        Мы создаём климат,<br />в котором легко жить
      </h2>
      <p className="text-gray-700 text-2xl leading-relaxed">
        Никаких шаблонов — только индивидуальный подбор под ваш стиль жизни. Мы знаем, как превратить технику в комфорт.
      </p>
    </div>

    {/* Картинка с текстом в правом верхнем углу */}
    <div className="md:col-span-7 relative">
      <img
        src="icons/cond.jpg"
        alt="Кондиционер"
        className="w-full h-[500px] object-cover rounded-3xl shadow-xl"
      />
      <div className="absolute top-6 right-6 bg-gray/80 backdrop-blur-md p-5 rounded-xl shadow-lg max-w-xs">
        <p className="text-gray-800 text-x1 leading-relaxed font-bold text-lg">
          15 лет устанавливаем климат-системы, которые работают годами. Нам доверяют, потому что мы знаем своё дело.
        </p>
      </div>
    </div>

  </div>
</section>
           <ClimatePromoSection />
          </div>      
           <section>
    <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-center md:gap-8">
        <div class="md:col-span-3">
          <img
            src="benefit/benefit5.jpg"
            class="rounded w-full h-full object-cover"
            alt=""
          />
        </div>

        <div class="md:col-span-1">
          <div class="max-w-lg md:max-w-none">
            <h2 class="text-2xl font-semibold text-gray-900 sm:text-3xl">
              Кондиционеры — ваш комфорт в любое время года!  
            </h2>

            <p class="mt-4 text-gray-700 text-xl">
              Современные кондиционеры — это идеальное решение для создания комфортного микроклимата в доме, офисе или любом другом помещении. 
              Они обеспечивают не только охлаждение в жаркие летние дни, но и поддерживают оптимальную температуру в прохладное время года благодаря функциям обогрева.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>   






          <ConditionerReviews/>
           
          <BrandGallery />
         
          
        </>
      </main>
    </div>
  )
}
