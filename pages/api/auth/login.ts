import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongo'
import { comparePassword, createToken } from '@/lib/auth'
import { serialize } from 'cookie'
import { withCSRF } from '@/lib/withCSRF'
// --- Бан по IP ---
const failedAttempts: Record<string, { count: number; lastAttempt: number }> = {}
const BAN_THRESHOLD = 5 // после 5 ошибок бан
const BAN_TIME_MS = 15 * 60 * 1000 // 15 минут бана

 async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end() // Только POST разрешён
  }

  const { email, password, captchaToken } = req.body
  if (!email || !password || !captchaToken) {
    return res.status(400).json({ message: 'Email, пароль и токен капчи обязательны' })
  }

  // Определяем IP пользователя
  const ip = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown'
  const now = Date.now()

  const attempt = failedAttempts[ip]

  // Проверяем, забанен ли IP
  if (attempt && attempt.count >= BAN_THRESHOLD && now - attempt.lastAttempt < BAN_TIME_MS) {
    return res.status(429).json({ message: 'Слишком много неудачных попыток. Попробуйте позже.' })
  }

  // Проверка токена капчи
  try {
    const verify = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY!,
        response: captchaToken,
      }),
    })

    const captchaResult = await verify.json()
    console.log('reCAPTCHA result:', captchaResult)

    if (!captchaResult.success || captchaResult.action !== 'login' || captchaResult.score < 0.5) {
      console.error('Ошибка проверки капчи:', captchaResult)
      return res.status(407).json({ message: 'Ошибка проверки капчи' })
    }
  } catch (err) {
    console.error('Ошибка при верификации капчи:', err)
    return res.status(500).json({ message: 'Ошибка сервера при проверке капчи' })
  }

  // Если капча пройдена, продолжаем логин
  const client = await clientPromise
  const db = client.db('dbcom')
  const users = db.collection('users')

  const user = await users.findOne({ email })

  if (!user) {
    // Увеличиваем счетчик при ошибке
    if (!failedAttempts[ip]) {
      failedAttempts[ip] = { count: 1, lastAttempt: now }
    } else {
      failedAttempts[ip].count++
      failedAttempts[ip].lastAttempt = now
    }
    return res.status(401).json({ message: 'Пользователь не найден' })
  }

  const valid = await comparePassword(password, user.passwordHash)

  if (!valid) {
    // Увеличиваем счетчик при ошибке
    if (!failedAttempts[ip]) {
      failedAttempts[ip] = { count: 1, lastAttempt: now }
    } else {
      failedAttempts[ip].count++
      failedAttempts[ip].lastAttempt = now
    }
    return res.status(401).json({ message: 'Неверный пароль' })
  }

  // При успешной авторизации сбрасываем счётчик
  if (failedAttempts[ip]) {
    delete failedAttempts[ip]
  }

  const token = await createToken({
    id: user._id,
    email: user.email,
    role: user.role,
  })

  res.setHeader('Set-Cookie', serialize('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 дней
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }))

  return res.status(200).json({ message: 'Успешный вход' })
}
export default (withCSRF(handler))
