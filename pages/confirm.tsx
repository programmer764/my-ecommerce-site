import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'

export default function ConfirmPage() {
  const router = useRouter()
  const [message, setMessage] = useState('⏳ Подтверждение...')
  const [loading, setLoading] = useState(true)
  const calledRef = useRef(false) // 🛡 защитный флаг

  useEffect(() => {
    const { token } = router.query

    if (!token || typeof token !== 'string') return
    if (calledRef.current) return // ← второй запуск? не делаем fetch

    calledRef.current = true

    const confirm = async () => {
      try {
        const res = await fetch(`/api/orders/confirm?token=${token}`)
        const data = await res.json()

        if (res.ok) {
          setMessage(`✅ ${data.message}`)
        } else {
          setMessage(`❌ ${data.message}`)
        }
      } catch (err) {
        setMessage('❌ Ошибка сети или сервера')
      } finally {
        setLoading(false)
      }
    }

    confirm()
  }, [router.query])

  return (
    <div style={{ padding: '2rem', fontSize: '1.2rem', textAlign: 'center' }}>
      <h1>Подтверждение заказа</h1>
      <p>{message}</p>
      {!loading && (
        <button
          onClick={() => router.push('/')}
          style={{
            marginTop: '1rem',
            padding: '0.6rem 1.2rem',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Вернуться на сайт
        </button>
      )}
    </div>
  )
}
