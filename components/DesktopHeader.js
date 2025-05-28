import Link from 'next/link'
import Image from 'next/image'
import SearchBar from './SearchBar'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import CategoryDrawer from '@/components/CategoryDrawer'

const DesktopHeader = () => {
  const [user, setUser] = useState(null)
  const router = useRouter()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const timeoutRef = useRef(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsMenuOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false)
    }, 200) // 200 мс задержка для удобства
  }

  useEffect(() => {
    let isMounted = true

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        if (!isMounted) return

        if (res.ok) {
          const user = await res.json()
          setUser(user)
        } else {
          setUser(null)
        }
      } catch {
        if (isMounted) setUser(null)
      }
    }

    fetchUser()
    const handleRouteChange = () => fetchUser()
    router.events?.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events?.off('routeChangeComplete', handleRouteChange)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      isMounted = false
    }
  }, [router])

  const handleLogout = async () => {
    await axios.post('/api/auth/logout')
    setUser(null)
    router.push('/login')
  }

  return (
    <header className="bg-gradient-to-r from-blue-200 to-gray-300 text-black shadow-md z-10 sticky top-0">
      <CategoryDrawer />
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/icons/logo2.svg" alt="Логотип" width={150} height={150} />
          </Link>
          <span className="text-2xl font-bold text-blue-800">ClimaTrade</span>
        </div>

        <div className="my-2 md:my-0">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <div className="flex items-center gap-2 ml-3 mr-5">
            <Image src="/icons/c1.svg" alt="Телефон" width={32} height={32} />
            <div className="flex flex-col leading-tight">
              <span className="text-blue-800 text-lg font-semibold whitespace-nowrap">
                +7 (123) 456-78-90
              </span>
              <span className="text-sm text-blue-800">с 10:00 до 18:00</span>
            </div>
          </div>
          <Link href="/">
            <Image src="/icons/m1.svg" alt="m1" width={32} height={32} />
          </Link>
          <Link href="/">
            <Image src="/icons/t1.svg" alt="t1" width={32} height={32} />
          </Link>
          <Link href="/">
            <Image src="/icons/f1.svg" alt="f1" width={32} height={32} />
          </Link>
          <Link href="/">
            <Image src="/icons/tw1.svg" alt="tw1" width={32} height={32} />
          </Link>

          <div
            className="relative ml-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {user ? (
              <div className="cursor-pointer px-3 py-2 bg-blue-100 rounded hover:bg-blue-200 transition">
                👤 {user.email}
              </div>
            ) : (
              <div className="flex gap-4 whitespace-nowrap">
                <Link
                  href="/login"
                  className="group relative inline-block overflow-hidden border border-blue-800 px-6 py-2 max-w-[120px] focus:ring-3 focus:outline-none"
                >
                  <span className="absolute inset-y-0 left-0 w-[2px] bg-blue-800 transition-all duration-300 ease-out group-hover:w-full z-0"></span>
                  <span className="relative z-10 text-sm font-medium text-blue-800 transition-colors duration-300 group-hover:text-white">
                    Войти
                  </span>
                </Link>

                <Link
                  href="/register"
                  className="group relative inline-block overflow-hidden border border-blue-800 px-6 py-2 max-w-[200px] focus:ring-3 focus:outline-none"
                >
                  <span className="absolute inset-y-0 left-0 w-[2px] bg-blue-800 transition-all duration-300 ease-out group-hover:w-full z-0"></span>
                  <span className="relative z-10 text-sm font-medium text-blue-800 transition-colors duration-300 group-hover:text-white">
                    Зарегистрироваться
                  </span>
                </Link>
              </div>
            )}

            {user && isMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white border shadow-md rounded min-w-[200px] z-50 animate-fade-in">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Профиль
                </Link>
                <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100">
                  Мои заказы
                </Link>

                {user.role === 'admin' && (
                  <>
                    <div className="px-4 py-1 text-xs text-gray-500">Администрирование</div>
                    <Link href="/admin/orders" className="block px-4 py-2 hover:bg-gray-100">
                      📦 Заказы
                    </Link>
                    <Link href="/admin/products" className="block px-4 py-2 hover:bg-gray-100">
                      📦 Товары
                    </Link>
                    <Link href="/admin/users" className="block px-4 py-2 hover:bg-gray-100">
                      👥 Пользователи
                    </Link>
                    <Link href="/admin/excel" className="block px-4 py-2 hover:bg-gray-100">
                      📊 Excel
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Выйти
                </button>
              </div>
            )}            
          </div>
        </div>
      </div>
    </header>
  )
}

export default DesktopHeader
