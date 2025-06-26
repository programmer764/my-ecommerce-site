// pages/api/orders/index.ts
import type { NextApiResponse } from 'next'
import { withAuth, AuthenticatedRequest } from '@/lib/withauth'
import clientPromise from '@/lib/mongo'
import { ObjectId } from 'mongodb'

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end('Method Not Allowed')
  }

  const client = await clientPromise
  const orders = client.db('dbcom').collection('orders')
  const user = req.user

  const {
    email: searchEmail,
    status: searchStatus,
    confirmed: confirmedStr,
    limit: limitStr,
    skip: skipStr,
  } = req.query as Record<string, string>

  const limit = Math.min(parseInt(limitStr) || 20, 100)
  const skip = parseInt(skipStr) || 0

  const filter: any = {}
  if (user.role === 'admin') {
    if (searchEmail) filter.email = { $regex: searchEmail, $options: 'i' }
    if (confirmedStr === 'true') filter.confirmed = true
    if (confirmedStr === 'false') filter.confirmed = false
  } else {
    filter.email = user.email
  }

  if (searchStatus && searchStatus !== 'все') {
    filter.status = searchStatus
  }

  const [docs, totalCount] = await Promise.all([
    orders.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    orders.countDocuments(filter),
  ])

  return res.status(200).json({ data: docs, pagination: { total: totalCount, limit, skip } })
}

export default withAuth(handler)
