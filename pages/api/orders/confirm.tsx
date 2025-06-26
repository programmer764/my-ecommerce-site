import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongo'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') return res.status(405).end()

      const rawToken = req.query.token
      const token = typeof rawToken === 'string'
        ? rawToken
        : Array.isArray(rawToken)
          ? rawToken[0]
          : ''
    if (!token) {
      return res.status(400).json({ message: 'Токен не передан' })
    }

    const client = await clientPromise
    const db = client.db('dbcom')
    const orders = db.collection('orders')

    console.log('🔐 Токен из запроса:', token)

    const order = await orders.findOne({ confirmationToken: token })

    console.log('📦 Найденный заказ:', order)

    if (!order) {
      return res.status(400).json({ message: 'Неверный или устаревший токен' })
    }

    if (order.confirmed) {
      return res.status(200).json({ message: 'Уже подтверждено' })
    }

    await orders.updateOne(
      { confirmationToken: token },
      { $set: { confirmed: true }, $unset: { confirmationToken: '' } }
    )

    return res.status(200).json({ message: 'Заказ подтверждён' })

  } catch (error) {
    console.error('❌ Ошибка при подтверждении заказа:', error)
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
  }
}
