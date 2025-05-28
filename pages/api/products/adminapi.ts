// pages/api/products/adminapi.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongo'
import { verifyToken } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { withAuth } from '@/lib/withauth'
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise
  const coll = client.db('dbcom').collection('dbcom2')

  // 1) Проверка авторизации
  let user: { email: string; id: string; role?: string } | null = null
  try {
    const token = req.cookies.token
    if (token) user = await verifyToken(token) as any

  } catch {}
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещён' })
  }
  
  if (req.method !== 'GET') {
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещён' })
    }
  }

  // 2) Обработка методов
  switch (req.method) {
    case 'GET': {
      const {
        search = '',
        sortBy = 'name',
        sortDir = 'asc',
        page = '1',
        brand = 'Все',
        all = 'false'
      } = req.query as Record<string, string>

      const getAll = all === 'true'
      const pageNum = Math.max(1, parseInt(page, 10))
      const limit = 15
      const skip = (pageNum - 1) * limit

      const filter: any = {}
      if (search.trim()) {
        const words = search.trim().split(/\s+/)
        filter.$and = words.map(word => ({
          name: { $regex: word, $options: 'i' }
        }))
      }
      if (brand !== 'Все') {
        filter.characteristics = {
          $elemMatch: { name: 'Производитель', value: brand }
        }
      }

      const sortStage: any = {}
      sortStage[sortBy] = sortDir === 'asc' ? 1 : -1

      const [products, totalCount] = await Promise.all([
        coll.find(filter)
          .sort(sortStage)
          .skip(getAll ? 0 : skip)
          .limit(getAll ? 9999 : limit)
          .toArray(),
        coll.countDocuments(filter)
      ])

      return res.status(200).json({ products, totalCount })
    }

    case 'POST': {
      const data = req.body
      if (typeof data.quantity !== 'number') data.quantity = 0
      const result = await coll.insertOne(data)
      return res.status(201).json({ ...data, _id: result.insertedId })
    }

    case 'PUT': {
      const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
      if (!id) return res.status(400).json({ message: 'Missing ID' })
      const data = req.body
      await coll.updateOne({ _id: new ObjectId(id) }, { $set: data })
      return res.status(200).json({ _id: id, ...data })
    }

    case 'DELETE': {
      const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
      if (!id) return res.status(400).json({ message: 'Missing ID' })
      await coll.deleteOne({ _id: new ObjectId(id) })
      return res.status(200).json({ _id: id })
    }

    case 'PATCH': {
      interface BulkPayload {
        ids: string[];
        charName: string;
        charValue?: string;
        operation: 'add' | 'update' | 'remove';
      }

      const { ids, charName, charValue, operation } = req.body as BulkPayload
      if (!Array.isArray(ids) || !charName) {
        return res.status(400).json({ message: 'Invalid payload' })
      }

      const objectIds = ids.map(id => new ObjectId(id))

      if (operation === 'add') {
        await coll.updateMany(
          { _id: { $in: objectIds } },
          { $push: { characteristics: { name: charName, value: charValue } } } as any
        )
      } else if (operation === 'update') {
        await coll.updateMany(
          { _id: { $in: objectIds } },
          {
            $set: { 'characteristics.$[elem].value': charValue }
          },
          {
            arrayFilters: [{ 'elem.name': charName }]
          }
        )
      } else if (operation === 'remove') {
        await coll.updateMany(
          { _id: { $in: objectIds } },
          { $pull: { characteristics: { name: charName } } } as any
        )
      }

      return res.status(200).json({ updatedCount: objectIds.length })
    }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default withAuth(handler, { roles: ['admin'] })
