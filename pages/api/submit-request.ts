// /pages/api/submit-request.ts
import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongo' // путь к MongoDB клиенту
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { task, price, areaFrom, areaTo, phone } = req.body

    if (!phone) return res.status(400).json({ message: 'Phone is required' })

    const client = await clientPromise
    const db = client.db('dbcom') // замени на имя своей базы
    const collection = db.collection('requests')

    const result = await collection.insertOne({
      task,
      price,
      area: { from: areaFrom, to: areaTo },
      phone,
      createdAt: new Date(),
    })

    return res.status(200).json({ message: 'Request saved', id: result.insertedId })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
