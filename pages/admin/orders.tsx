import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'

type OrderItem = {
  name: string
  quantity: number
}

type Order = {
  _id: string
  email: string
  items: OrderItem[]
  total: number
  status: 'новый' | 'оплачен' | 'отправлен' | 'доставлен'
  confirmed: boolean
  createdAt: string
}

const ITEMS_PER_PAGE = 15

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [statusFilter, setStatusFilter] = useState<string>('все')
  const [emailFilter, setEmailFilter] = useState<string>('')
  const [confirmedFilter, setConfirmedFilter] = useState<string>('') // '', 'true', 'false'
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const fetchOrders = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (emailFilter.trim()) params.append('email', emailFilter.trim())
    if (statusFilter !== 'все') params.append('status', statusFilter)
    if (confirmedFilter !== '') params.append('confirmed', confirmedFilter)
    params.append('limit', ITEMS_PER_PAGE.toString())
    params.append('skip', ((currentPage - 1) * ITEMS_PER_PAGE).toString())
  
    try {
      const res = await fetch('/api/orders?' + params.toString(), {
        credentials: 'include',
      })
      const response = await res.json()
      setOrders(response.data || [])
      setTotalPages(Math.ceil((response.pagination?.total || 0) / ITEMS_PER_PAGE))
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchOrders()
  }, [statusFilter, emailFilter, confirmedFilter])

  const handleStatusChange = async (id: string, newStatus: Order['status']) => {
    setLoading(true)
    await fetch('/api/orders/update-status', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    })
    await fetchOrders()
  }

 
  const visibleOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Заказы</h1>

        <div className="mb-4 flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-sm block mb-1">Поиск по email:</label>
            <input
              type="email"
              placeholder="user@example.com"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className="p-2 border rounded w-64"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Фильтр по статусу:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="все">все</option>
              <option value="новый">новый</option>
              <option value="оплачен">оплачен</option>
              <option value="отправлен">отправлен</option>
              <option value="доставлен">доставлен</option>
            </select>
          </div>

          <div>
            <label className="text-sm block mb-1">Подтверждение email:</label>
            <select
              value={confirmedFilter}
              onChange={(e) => setConfirmedFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">все</option>
              <option value="true">подтверждённые</option>
              <option value="false">неподтверждённые</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Загрузка...</p>
        ) : visibleOrders.length === 0 ? (
          <p>Нет заказов</p>
        ) : (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2">Email</th>
                  <th className="border px-3 py-2">Товары</th>
                  <th className="border px-3 py-2">Сумма</th>
                  <th className="border px-3 py-2">Статус</th>
                  <th className="border px-3 py-2">Дата</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="border px-3 py-2">{order.email}</td>
                    <td className="border px-3 py-2">
                      <ul>
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="border px-3 py-2">{order.total} ₽</td>
                    <td className="border px-3 py-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value as Order['status'])
                        }
                        className="border p-1 rounded"
                      >
                        <option value="новый">новый</option>
                        <option value="оплачен">оплачен</option>
                        <option value="отправлен">отправлен</option>
                        <option value="доставлен">доставлен</option>
                      </select>
                    </td>
                    <td className="border px-3 py-2">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex justify-center gap-2 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
    </Layout>
  )
}
