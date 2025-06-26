import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [captchaReady, setCaptchaReady] = useState(false)
  const isProcessingRef = useRef(false)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) setCart(JSON.parse(stored))

    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(u => {
        setIsAuthenticated(true)
        setEmail(u.email)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => setCaptchaReady(true))
    }
  }, [])

  const total = cart.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0)

  const handleOrder = async () => {
    await fetch('/api/csrf', { credentials: 'include' })
    await new Promise(res => setTimeout(res, 100))

    if (isProcessingRef.current) return
    isProcessingRef.current = true
    setLoading(true)
    setMessage('')

    if (cart.length === 0) {
      setMessage('❌ Корзина пуста')
      setLoading(false)
      isProcessingRef.current = false
      return
    }

    if (!isAuthenticated && !email) {
      setMessage('❌ Введите email')
      setLoading(false)
      isProcessingRef.current = false
      return
    }

    if (!captchaReady || !window.grecaptcha) {
      setMessage('⚠️ Подождите, reCAPTCHA загружается')
      setLoading(false)
      isProcessingRef.current = false
      return
    }

    try {
      const captchaToken = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        { action: 'checkout' }
      )

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          total,
          captchaToken,
          email,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Ошибка')

      // ✅ Отправка на оплату в YooKassa
      const paymentRes = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: total.toFixed(2) }),
      })

      const paymentData = await paymentRes.json()
      if (!paymentRes.ok) throw new Error(paymentData.error || 'Ошибка оплаты')

      if (paymentData.confirmationUrl) {
        localStorage.removeItem('cart')
        window.dispatchEvent(new Event('storage'))
        window.location.href = paymentData.confirmationUrl
        return
      }

      setMessage('⚠️ Не удалось получить ссылку на оплату')
      setLoading(false)
      isProcessingRef.current = false
    } catch (err: any) {
      console.error(err)
      setMessage(`❌ ${err.message}`)
      setLoading(false)
      isProcessingRef.current = false
    }
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Оформление заказа</h1>

        {cart.length === 0 ? (
          <p>Ваша корзина пуста</p>
        ) : (
          <>
            <ul className="mb-4 space-y-2">
              {cart.map((item, i) => (
                <li key={i} className="border p-2 rounded">
                  <strong>{item.name}</strong> × {item.quantity || 1} —{' '}
                  {item.price * (item.quantity || 1)} ₽
                </li>
              ))}
            </ul>

            <p className="font-semibold mb-4">Итого: {total} ₽</p>

            {!isAuthenticated && !submitted && (
              <input
                type="email"
                placeholder="Ваш email"
                className="w-full p-2 border rounded mb-4"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            )}

            <button
              onClick={handleOrder}
              disabled={loading || submitted}
              className={`w-full py-2 rounded text-white ${
                loading || submitted
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Оформляется...' : submitted ? 'Готово' : 'Оформить заказ'}
            </button>

            {message && <p className="mt-4 text-center">{message}</p>}
          </>
        )}
      </div>
    </>
  )
}
