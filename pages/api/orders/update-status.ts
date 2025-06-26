// pages/api/orders/update-status.ts
import type { NextApiResponse } from 'next'
import { withAuth, AuthenticatedRequest } from '@/lib/withauth'
import clientPromise from '@/lib/mongo'
import { ObjectId } from 'mongodb'

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT'])
    return res.status(405).end('Method Not Allowed')
  }

  const user = req.user
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Нет доступа' })
  }

  const { id, status } = req.body
  if (!ObjectId.isValid(id) || !['новый', 'оплачен', 'отправлен', 'доставлен'].includes(status)) {
    return res.status(400).json({ message: 'Неверные данные' })
  }

  const client = await clientPromise
  const orders = client.db('dbcom').collection('orders')
  await orders.updateOne({ _id: new ObjectId(id) }, { $set: { status } })

  return res.status(200).json({ message: 'Статус изменён' })
}

export default withAuth(handler, { roles: ['admin'] })
