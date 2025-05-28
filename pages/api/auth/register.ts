import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongo'
import { hashPassword } from '@/lib/auth'
import { withCSRF } from '@/lib/withCSRF'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' })
  }
  
  try {
    const client = await clientPromise
    const db = client.db('dbcom') // убедись, что имя базы соответствует твоим настройкам
    const users = db.collection('users')

    const existingUser = await users.findOne({ email })
    if (existingUser) return res.status(400).json({ message: 'Пользователь уже существует' })

    const passwordHash = await hashPassword(password)

    await users.insertOne({
      email,
      passwordHash,
      role: 'user', // обычный пользователь
      createdAt: new Date()
    })
    
    console.log('✅ Пользователь успешно зарегистрирован:', email)

    return res.status(201).json({ message: 'Пользователь зарегистрирован' })
  } catch (err) {
    console.error('❌ Ошибка регистрации:', err)
    return res.status(500).json({ message: 'Ошибка сервера' })
  }
}
export default (withCSRF(handler))
