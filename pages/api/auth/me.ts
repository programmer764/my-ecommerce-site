// pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Разрешаем только GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  // Читаем токен из куки
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ message: 'Нет токена' })
  }

  try {
    // Проверяем подпись и срок жизни токена
    const user = await verifyToken(token) as {
      id: string
      email: string
      role?: string
    }
    // Возвращаем payload
    return res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role ?? 'user',
    })
  } catch (err) {
    // Невалидный или просроченный токен
    return res.status(401).json({ message: 'Невалидный токен' })
  }
}
