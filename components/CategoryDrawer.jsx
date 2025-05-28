'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/24/outline'

const categories = [
  { label: 'Настенные кондиционеры', href: '/catalog/nastennye-konditsionery-split-sistemy', icon: '/icons/l1.svg' },
  { label: 'Мульти сплит-системы', href: '/catalog/multi-split-sistemy', icon: '/icons/l6.svg' },
  { label: 'Канальные кондиционеры', href: '/catalog/kanalnye-konditsionery', icon: '/icons/l2.svg' },
  { label: 'Кассетные кондиционеры', href: '/catalog/kassetnye-konditsionery', icon: '/icons/l4.svg' },
  { label: 'Мобильные кондиционеры', href: '/catalog/mobilnye-konditsionery', icon: '/icons/l5.svg' },
  { label: 'Напольно-потолочные', href: '/catalog/napolno-potolochnye', icon: '/icons/l6.svg' },
  { label: 'Мультизональные VRF', href: '/catalog/multizonalnye-vrf', icon: '/icons/l7.svg' },
  { label: 'Фанкойлы', href: '/catalog/fankoyly', icon: '/icons/l1.svg' },
  { label: 'Колонные кондиционеры', href: '/catalog/kolonnye', icon: '/icons/l2.svg' },
  { label: 'Тепловые насосы', href: '/catalog/teplovye-nasosy', icon: '/icons/l3.svg' },
  { label: 'Оконные кондиционеры', href: '/catalog/okonnye-konditsionery', icon: '/icons/l4.svg' },
  { label: 'Холодильные системы', href: '/catalog/holodilnye-split-sistemy', icon: '/icons/l5.svg' },
]

export default function CategoryDrawer() {
  const [open, setOpen] = useState(false)

  // Функция для закрытия меню
  const closeMenu = () => setOpen(false)

  return (
    <>
      <button
        onClick={() => setOpen(prev => !prev)} // переключаем открытие по кнопке
        className="fixed top-20 right-4 z-50  bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 shadow hover:bg-blue-600 rounded-3xl text-base flex items-center justify-center"
>
        Категории
      </button>

      {open && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-1/6 bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-xl font-semibold">Категории</h2>
          <button onClick={closeMenu}>
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <ul className="p-4 space-y-3 overflow-y-auto h-[calc(100%-60px)]">
          {categories.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                onClick={closeMenu} // закрываем меню при клике на ссылку
                className="flex items-center gap-3 bg-blue-100 hover:bg-white hover:text-[#2a7bbc] text-blue-900 font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Image src={item.icon} alt={item.label} width={24} height={24} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
