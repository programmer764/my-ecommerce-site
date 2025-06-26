
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'

export default function OrderDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        const found = data.find((o: any) => o._id === id)
        setOrder(found)
        setLoading(false)
      })
  }, [id])

  if (loading) return <Layout><p className="p-4">Загрузка...</p></Layout>
  if (!order) return <Layout><p className="p-4">Заказ не найден</p></Layout>

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Заказ №{order._id}</h1>
        <p className="mb-2"><strong>Email:</strong> {order.email}</p>
        <p className="mb-2"><strong>Дата:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p className="mb-2"><strong>Статус:</strong> {order.status}</p>
        <p className="mb-4"><strong>Сумма:</strong> {order.total} ₽</p>

        <h2 className="text-lg font-semibold mb-2">Товары:</h2>
        <ul className="list-disc pl-6">
          {order.items.map((item: any, i: number) => (
            <li key={i}>
              {item.name} — {item.quantity} × {item.price} ₽ = {item.quantity * item.price} ₽
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}
