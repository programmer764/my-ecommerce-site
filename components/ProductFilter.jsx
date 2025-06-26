// components/ProductFilter.jsx
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

export default function ProductFilter({
  availableBrands = [],
  availableCountries = []
}) {
  const router = useRouter()
  const {
    slug,
    search, minPrice, maxPrice,
    brand: brandQuery, country: countryQuery,
    compressor: compQuery,
    remoteControl: rcQuery,
    minArea: aMinQ, maxArea: aMaxQ,
    minHeat: hMinQ, maxHeat: hMaxQ,
    minCool: cMinQ, maxCool: cMaxQ,
    minNoise: nMinQ, maxNoise: nMaxQ
  } = router.query

  // Дефолтные диапазоны и значения
  const DEF_PRICE = [0, 200000]
  const DEF_AREA  = [0, 100]
  const DEF_HEAT  = [0, 10]
  const DEF_COOL  = [0, 10]
  const DEF_NOISE = [0, 100]
  const DEF_RADIO = 'Все'

  // Локальные стейты
  const [searchQuery, setSearchQuery] = useState(search || '')
  const [priceRange, setPriceRange]   = useState([
    minPrice ? +minPrice : DEF_PRICE[0],
    maxPrice ? +maxPrice : DEF_PRICE[1]
  ])
  const [selectedBrand, setSelectedBrand]         = useState(brandQuery  || DEF_RADIO)
  const [selectedCountry, setSelectedCountry]     = useState(countryQuery|| DEF_RADIO)
  const [selectedCompressor, setSelectedCompressor]   = useState(compQuery  || DEF_RADIO)
  const [selectedRemoteControl, setSelectedRemoteControl] = useState(rcQuery || 'Нет')
  const [areaRange, setAreaRange]       = useState([
    aMinQ ? +aMinQ : DEF_AREA[0],
    aMaxQ ? +aMaxQ : DEF_AREA[1]
  ])
  const [heatRange, setHeatRange]       = useState([
    hMinQ ? +hMinQ : DEF_HEAT[0],
    hMaxQ ? +hMaxQ : DEF_HEAT[1]
  ])
  const [coolRange, setCoolRange]       = useState([
    cMinQ ? +cMinQ : DEF_COOL[0],
    cMaxQ ? +cMaxQ : DEF_COOL[1]
  ])
  const [noiseRange, setNoiseRange]     = useState([
    nMinQ ? +nMinQ : DEF_NOISE[0],
    nMaxQ ? +nMaxQ : DEF_NOISE[1]
  ])

  // Показать всё / свернуть
  const [showAllBrands, setShowAllBrands]       = useState(false)
  const [showAllCountries, setShowAllCountries] = useState(false)

  // При смене категории — сброс локальных фильтров
  useEffect(() => {
    resetLocal()
  }, [slug])

  // Сброс всех локальных стейтов
  function resetLocal() {
    setSearchQuery('')
    setPriceRange(DEF_PRICE.slice())
    setSelectedBrand(DEF_RADIO)
    setSelectedCountry(DEF_RADIO)
    setSelectedCompressor(DEF_RADIO)
    setSelectedRemoteControl('Нет')
    setAreaRange(DEF_AREA.slice())
    setHeatRange(DEF_HEAT.slice())
    setCoolRange(DEF_COOL.slice())
    setNoiseRange(DEF_NOISE.slice())
    setShowAllBrands(false)
    setShowAllCountries(false)
  }

  // Применить фильтры → обновляем URL
  const applyFilters = () => {
    const q = { page: 1 }
    if (searchQuery.trim())     q.search    = searchQuery.trim()
    if (priceRange[0] !== DEF_PRICE[0]) q.minPrice = priceRange[0]
    if (priceRange[1] !== DEF_PRICE[1]) q.maxPrice = priceRange[1]

    if (selectedBrand     !== DEF_RADIO) q.brand = selectedBrand
    if (selectedCountry   !== DEF_RADIO) q.country = selectedCountry
    if (selectedCompressor!== DEF_RADIO) q.compressor = selectedCompressor
    if (selectedRemoteControl === 'Есть') q.remoteControl = true

    if (areaRange[0] !== DEF_AREA[0]) q.minArea = areaRange[0]
    if (areaRange[1] !== DEF_AREA[1]) q.maxArea = areaRange[1]
    if (heatRange[0] !== DEF_HEAT[0]) q.minHeat = heatRange[0]
    if (heatRange[1] !== DEF_HEAT[1]) q.maxHeat = heatRange[1]
    if (coolRange[0] !== DEF_COOL[0]) q.minCool = coolRange[0]
    if (coolRange[1] !== DEF_COOL[1]) q.maxCool = coolRange[1]
    if (noiseRange[0] !== DEF_NOISE[0]) q.minNoise = noiseRange[0]
    if (noiseRange[1] !== DEF_NOISE[1]) q.maxNoise = noiseRange[1]

    const path = slug ? `/catalog/${slug}` : '/'
    router.push({ pathname: path, query: q })
  }

  // Сбросить все → очищаем и локально, и в URL
  const resetAll = () => {
    resetLocal()
    const base = slug ? `/catalog/${slug}` : '/'
    router.push(base, base, { shallow: true })
  }

  // Подготовка списков: всегда «Все» сверху
  const brandsList = [DEF_RADIO, ...availableBrands]
  const countriesList = [DEF_RADIO, ...availableCountries]
  const compressors = [DEF_RADIO, 'Инвертор', 'Не инвертор']
  const remoteOptions = ['Нет', 'Есть']

  const visibleBrands    = showAllBrands    ? brandsList    : brandsList.slice(0, 5)
  const visibleCountries = showAllCountries ? countriesList : countriesList.slice(0, 5)

  return (
    <div className="w-full md:w p-4 border-b md:border-r border-gray-100">
      <h2 className="text-xl font-bold mb-4">Фильтр</h2>

      {/* Поиск */}
      <input
        type="text"
        placeholder="Поиск по названию..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Цена */}
      <h3 className="text-lg font-semibold mb-2">Цена, ₽</h3>
      <Slider
        range min={DEF_PRICE[0]} max={DEF_PRICE[1]} step={1000}
        value={priceRange} onChange={setPriceRange}
      />
      <div className="flex justify-between text-sm mb-4">
        <span>{priceRange[0]}</span>
        <span>{priceRange[1]}</span>
      </div>

      {/* Бренд */}
      <h3 className="text-lg font-semibold mb-2">Бренд</h3>
      <div className="max-h-48 overflow-y-auto mb-2">
        {visibleBrands.map(b => (
          <label key={b} className="flex items-center space-x-2 mb-1">
            <input
              type="radio" name="brand" value={b}
              checked={selectedBrand === b}
              onChange={() => setSelectedBrand(b)}
            />
            <span>{b}</span>
          </label>
        ))}
      </div>
      {brandsList.length > 5 && (
        <button
          onClick={() => setShowAllBrands(!showAllBrands)}
          className="text-blue-500 text-sm mb-4"
        >
          {showAllBrands ? 'Показать меньше ▲' : 'Показать все ▼'}
        </button>
      )}

      {/* Страна бренда */}
      <h3 className="text-lg font-semibold mb-2">Страна бренда</h3>
      <div className="max-h-48 overflow-y-auto mb-2">
        {visibleCountries.map(c => (
          <label key={c} className="flex items-center space-x-2 mb-1">
            <input
              type="radio" name="country" value={c}
              checked={selectedCountry === c}
              onChange={() => setSelectedCountry(c)}
            />
            <span>{c}</span>
          </label>
        ))}
      </div>
      {countriesList.length > 5 && (
        <button
          onClick={() => setShowAllCountries(!showAllCountries)}
          className="text-blue-500 text-sm mb-4"
        >
          {showAllCountries ? 'Показать меньше ▲' : 'Показать все ▼'}
        </button>
      )}

      {/* Компрессор */}
      <h3 className="text-lg font-semibold mb-2">Компрессор</h3>
      {compressors.map(opt => (
        <label key={opt} className="flex items-center space-x-2 mb-1">
          <input
            type="radio" name="compressor" value={opt}
            checked={selectedCompressor === opt}
            onChange={() => setSelectedCompressor(opt)}
          />
          <span>{opt}</span>
        </label>
      ))}

      {/* Площадь помещения */}
      <h3 className="text-lg font-semibold mt-4 mb-2">Площадь (кв.м.)</h3>
      <Slider
        range min={DEF_AREA[0]} max={DEF_AREA[1]} step={1}
        value={areaRange} onChange={setAreaRange}
      />
      <div className="flex justify-between text-sm mb-4">
        <span>{areaRange[0]}</span>
        <span>{areaRange[1]}</span>
      </div>

      {/* Обогрев */}
      <h3 className="text-lg font-semibold mb-2">Обогрев (кВт)</h3>
      <Slider
        range min={DEF_HEAT[0]} max={DEF_HEAT[1]} step={0.1}
        value={heatRange} onChange={setHeatRange}
      />
      <div className="flex justify-between text-sm mb-4">
        <span>{heatRange[0].toFixed(1)}</span>
        <span>{heatRange[1].toFixed(1)}</span>
      </div>

      {/* Охлаждение */}
      <h3 className="text-lg font-semibold mb-2">Охлаждение (кВт)</h3>
      <Slider
        range min={DEF_COOL[0]} max={DEF_COOL[1]} step={0.1}
        value={coolRange} onChange={setCoolRange}
      />
      <div className="flex justify-between text-sm mb-4">
        <span>{coolRange[0].toFixed(1)}</span>
        <span>{coolRange[1].toFixed(1)}</span>
      </div>

      {/* Уровень шума */}
      <h3 className="text-lg font-semibold mb-2">Шум (дБ)</h3>
      <Slider
        range min={DEF_NOISE[0]} max={DEF_NOISE[1]} step={1}
        value={noiseRange} onChange={setNoiseRange}
      />
      <div className="flex justify-between text-sm mb-4">
        <span>{noiseRange[0]}</span>
        <span>{noiseRange[1]}</span>
      </div>

      {/* Пульт дистанционного управления */}
      <h3 className="text-lg font-semibold mb-2">Пульт ДУ</h3>
      {remoteOptions.map(opt => (
        <label key={opt} className="flex items-center space-x-2 mb-1">
          <input
            type="radio" name="remoteControl" value={opt}
            checked={(selectedRemoteControl === 'Есть' ? 'Есть' : 'Нет') === opt}
            onChange={() => setSelectedRemoteControl(opt)}
          />
          <span>{opt}</span>
        </label>
      ))}

      {/* Кнопки */}
      <button
        onClick={applyFilters}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2"
      >
        Применить фильтр
      </button>
      <button
        onClick={resetAll}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Сбросить фильтры
      </button>
    </div>
  )
}
