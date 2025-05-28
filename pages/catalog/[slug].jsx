// pages/catalog/[slug].js
import { useState, useEffect } from 'react'
import axios from 'axios'
import clientPromise from '@/lib/mongo'
import ProductCard   from '@/components/ProductCard'
import ProductFilter from '@/components/ProductFilter'
import Pagination    from '@/components/Pagination'
import FilterButton  from '@/components/FilterButton'

export async function getServerSideProps({ params, query }) {
  const { slug } = params
  const page = parseInt(query.page || '1', 10)

  // 1) API-запрос с categorySlug
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
    { params: { ...query, categorySlug: slug } }
  )
  const { products, totalCount } = data

  // 2) Вытягиваем бренды / страны только для этой категории
  const client = await clientPromise
  const coll   = client.db('dbcom').collection('dbcom2')

  const docsB = await coll
    .find({ categorySlug: slug, 'characteristics.name': 'Производитель' })
    .project({ characteristics: 1 })
    .toArray()
  const availableBrands = Array.from(new Set(
    docsB
      .map(d => d.characteristics.find(c => c.name === 'Производитель')?.value)
      .filter(Boolean)
  ))

  const docsC = await coll
    .find({ categorySlug: slug, 'characteristics.name': 'Страна бренда' })
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
      currentPage: page,
      categorySlug: slug,
      availableBrands,
      availableCountries
    }
  }
}

export default function CatalogPage({
  products,
  totalCount,
  currentPage,
  categorySlug,
  availableBrands,
  availableCountries
}) {
  const [showFilter, setShowFilter] = useState(false)
  const [isClient,   setIsClient]   = useState(false)
  useEffect(() => setIsClient(true), [])
const categoryNames = {
  'nastennye-konditsionery-split-sistemy': 'Настенные кондиционеры',
  'multi-split-sistemy': 'Мульти сплит-системы',
  'kanalnye-konditsionery': 'Канальные кондиционеры',
  'kassetnye-konditsionery': 'Кассетные кондиционеры',
  'mobilnye-konditsionery': 'Мобильные кондиционеры',
  'napolno-potolochnye': 'Напольно-потолочные',
  'multizonalnye-vrf': 'Мультизональные VRF',
  'fankoyly': 'Фанкойлы',
  'kolonnye': 'Колонные кондиционеры',
  'teplovye-nasosy': 'Тепловые насосы',
  'okonnye-konditsionery': 'Оконные кондиционеры',
  'holodilnye-split-sistemy': 'Холодильные системы',
  // Добавь остальные по аналогии
}
  const totalPages = Math.ceil(totalCount / 15)

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-4">
      <div className="mb-2 lg:hidden">
        <FilterButton showFilter={showFilter} toggleFilter={() => setShowFilter(!showFilter)} />
      </div>
      {isClient && (
        <aside className={`w-full lg:w-[250px] ${showFilter ? 'block' : 'hidden'} lg:block`}>
          <ProductFilter
            availableBrands={availableBrands}
            availableCountries={availableCountries}
          />
        </aside>
      )}
      <main className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold  text-gray-800 mb-8 px-4 py-3 border-b-2 border-gray-300 bg-blue-100 rounded-2xl shadow-sm">
  {categoryNames[categorySlug] || categorySlug.replace(/-/g, ' ')}
</h1>
        {products.length === 0 ? (
          <p className="text-center text-gray-500">Товары не найдены</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map(p => (<ProductCard key={p._id} product={p} />  ))}
          </div>
        )}
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/catalog/${categorySlug}`}
          />
        </div>
      </main>
    </div>
  )
}
