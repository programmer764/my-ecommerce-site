
import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'
import axios from 'axios'

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/me', { withCredentials: true })
      setUser(res.data)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
    const handleRouteChange = () => fetchUser()
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  const logout = async () => {
    await axios.post('/api/auth/logout')
    setUser(null)
    router.push('/')
  }

  const nav = [
    { href: '/admin/products', label: 'Товары' },
    { href: '/admin/orders', label: 'Заказы' },
    { href: '/admin/users', label: 'Пользователи' },
    { href: '/admin/excel', label: 'Эксель' },
  ]

  if (loading) return <div className="p-4">Загрузка...</div>

  if (!user || user.role !== 'admin') {
    return <div className="p-6 text-red-600 font-semibold">⛔ Доступ запрещён</div>
  }

  return (
    <>
      <Head>
        <title>Админка</title>
      </Head>
      <div className="flex min-h-screen bg-gray-100 text-gray-900">
        <aside className="w-64 bg-white border-r p-4 space-y-4">
          <h2 className="text-xl font-bold mb-4">Панель администратора</h2>
          <nav className="space-y-2">
            {nav.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={
                    'block px-3 py-2 rounded hover:bg-gray-200 cursor-pointer ' +
                    (router.pathname === item.href ? 'bg-gray-200 font-semibold' : '')
                  }
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-600">
              👋 {user.email} ({user.role})
            </span>
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:underline"
            >
              Выйти
            </button>
          </div>
          {children}
        </main>
      </div>
    </>
  )
}
