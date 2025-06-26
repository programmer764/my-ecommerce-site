import { useState, useEffect } from 'react'
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

export default function RegisterUserPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaReady, setCaptchaReady] = useState(false)

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

  const handleRegister = async () => {
    if (!email.includes('@')) {
      setMessage('❌ Некорректный email')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      if (!window.grecaptcha) {
        throw new Error('Ошибка загрузки reCAPTCHA. Пожалуйста, обновите страницу.')
      }

      const captchaToken = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        { action: 'register' }
      )

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
         credentials: 'include',
        body: JSON.stringify({ email, password, captchaToken }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('✅ Пользователь успешно зарегистрирован')
        router.push('/login')
      } else {
        setMessage(`❌ ${data.message}`)
      }
    } catch (err: any) {
      console.error(err)
      setMessage('❌ Ошибка при регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Подключение скрипта reCAPTCHA */}
      

      {/* Форма регистрации */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
          <h1 className="text-xl font-bold">Регистрация</h1>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleRegister}
            disabled={!captchaReady || loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Регистрируем...' : 'Зарегистрироваться'}
          </button>
          {message && <p className="text-sm text-center">{message}</p>}
        </div>
      </div>
    </>
  )
}
