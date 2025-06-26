// pages/api/products/bulk.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongo'
import { ObjectId, UpdateFilter } from 'mongodb'
import { withAuth } from '@/lib/withauth'

interface Characteristic { name: string; value: string }
interface Product { characteristics: Characteristic[]; [key: string]: any }

 async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { ids, charName, charValue, mode } = req.body as {
    ids: string[]
    charName: string
    charValue: string
    mode: 'add' | 'update'
  }

  const client = await clientPromise
  // Обратите внимание на generic <Product> — теперь TS знает структуру документов
  const coll = client.db('dbcom').collection<Product>('dbcom2')

  if (mode === 'add') {
    // Добавляем новый объект в массив characteristics
    const update: UpdateFilter<Product> = {
      $push: {
        characteristics: { name: charName, value: charValue } as any
      }
    }
    await coll.updateMany(
      { _id: { $in: ids.map(i => new ObjectId(i)) } },
      update
    )
  } else {
    // Меняем value у существующего элемента
    await coll.updateMany(
      {
        _id: { $in: ids.map(i => new ObjectId(i)) },
        'characteristics.name': charName
      },
      {
        $set: { 'characteristics.$.value': charValue }
      }
    )
  }

  return res.status(200).json({ ok: true })
}
export default withAuth(handler, { roles: ['admin'] })
