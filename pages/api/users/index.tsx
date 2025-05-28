import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongo'
import { verifyToken } from '@/lib/auth'
import { withAuth } from '@/lib/withauth'
type User = {
  _id: string
  email: string
  role?: 'user' | 'admin'
  createdAt: Date
}

 async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ message: 'Нет токена' })
  }

  let user
  try {
    // await здесь жизненно необходим
    user = await verifyToken(token) as {
      id: string
      email: string
      role?: string
    }
  } catch {
    return res.status(401).json({ message: 'Невалидный токен' })
  }

  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Нет доступа' })
  }

  try {
    const client = await clientPromise
    const db = client.db('dbcom')
    const users = await db
      .collection<User>('users')
      .find({})
      .sort({ createdAt: -1 })
      .project({ passwordHash: 0 }) // исключаем хэши паролей
      .toArray()

    return res.status(200).json(users)
  } catch (err) {
    console.error('❌ Ошибка при получении пользователей:', err)
    return res.status(500).json({ message: 'Ошибка сервера' })
  }
}
export default withAuth(handler, { roles: ['admin'] })
