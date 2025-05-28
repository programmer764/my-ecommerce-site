import { useEffect, useState } from 'react'
import DesktopHeader from '@/components/DesktopHeader'

interface OrderItem {
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  _id: string
  email: string
  items: OrderItem[]
  total: number
  createdAt: string
  status: 'новый' | 'оплачен' | 'отправлен' | 'доставлен'
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const limit = itemsPerPage
        const skip = (currentPage - 1) * itemsPerPage
        const res = await fetch(`/api/orders?limit=${limit}&skip=${skip}`, {
          credentials: 'include',
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || `Ошибка ${res.status}`)
  
        const normalized = (data.data as Order[]).map(o => ({
          ...o,
          status: o.status || 'новый',
        }))
  
        setOrders(normalized)
        setTotalPages(Math.ceil((data.pagination?.total || 0) / itemsPerPage))
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
  
    fetchOrders()
  }, [currentPage])
  

 
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <>
      
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">📦 Мои заказы</h1>

        {loading ? (
          <p>Загрузка...</p>
        ) : error ? (
          <p className="text-red-500">❌ {error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">У вас нет заказов</p>
        ) : (
          <>
            <ul className="space-y-6">
              {paginatedOrders.map(order => (
                <li key={order._id} className="border p-4 rounded-lg shadow">
                  <p className="font-semibold mb-1">
                    Заказ от {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="mb-2">
                    Статус:{' '}
                    <span className="font-medium">{order.status}</span>
                  </p>
                  <ul className="space-y-2 mb-4">
                    {order.items.map((item: OrderItem, idx: number) => (
                      <li key={idx} className="flex items-center gap-4">
                        <img
                          src={`/images/${item.image}`}
                          alt={item.name}
                          className="w-16 h-16 object-contain border rounded"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} × {item.price}₽ ={' '}
                            <span className="font-semibold">
                              {item.quantity * item.price}₽
                            </span>
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="font-bold text-blue-700">Итого: {order.total} ₽</p>
                </li>
              ))}
            </ul>

            {/* Пагинация */}
            <div className="mt-6 flex justify-center gap-2 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
