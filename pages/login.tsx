import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'
import axios from 'axios'

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaReady, setCaptchaReady] = useState(false)

  // Автоматически ждем grecaptcha после загрузки скрипта
  useEffect(() => {
     fetch('/api/csrf', { credentials: 'include' })
    if (window.grecaptcha) {
      console.log('✅ grecaptcha уже есть')
      window.grecaptcha.ready(() => {
        console.log('✅ grecaptcha готова')
        setCaptchaReady(true)
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!window.grecaptcha) {
        throw new Error('Ошибка загрузки reCAPTCHA. Пожалуйста, обновите страницу.')
      }

      const captchaToken = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, { action: 'login' })

      await axios.post('/api/auth/login', { email, password, captchaToken }, {
  withCredentials: true,
})


      const res = await axios.get('/api/auth/me')
      const user = res.data

      router.push(user.role === 'admin' ? '/admin/products' : '/')
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || err.message || 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ПРАВИЛЬНО подключаем скрипт через next/script */}
      

      {/* Форма */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
        >
          <h2 className="text-xl font-semibold text-center">Вход</h2>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <button
            type="submit"
            disabled={!captchaReady || loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>
      </div>
    </>
  )
}
