import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm, File } from 'formidable'
import fs from 'fs'
import * as XLSX from 'xlsx'
import { withAuth } from '@/lib/withauth'
import clientPromise from '@/lib/mongo'
import { verifyToken } from '@/lib/auth'

export const config = {
  api: {
    bodyParser: false,
  },
}

type Product = {
  name: string
  price: number
  quantity: number
  category?: string
  link?: string
  image?: string
  characteristics?: { name: string; value: string }[]
}

 async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise
  const db = client.db('dbcom')
  const products = db.collection<Product>('dbcom2')

  // Авторизация
  let user: { role?: string } | null = null
  try {
    const token = req.cookies.token
    if (token) user = verifyToken(token) as any
    if (!user || user.role !== 'admin') throw new Error('Требуется роль администратора')
  } catch {
    return res.status(403).json({ message: 'Нет доступа' })
  }

  // GET — экспорт в Excel
  if (req.method === 'GET') {
    const all = await products.find().toArray()

    const data = all.map(p => ({
      Название: p.name,
      Цена: p.price,
      Количество: p.quantity,
      Категория: p.category || '',
      Ссылка: p.link || '',
      Картинка: p.image || '',
      Характеристики: (p.characteristics || [])
        .map(c => `${c.name}: ${c.value}`)
        .join(' | ')
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Товары')

    worksheet['!cols'] = [
      { wch: 30 }, { wch: 10 }, { wch: 10 }, { wch: 20 },
      { wch: 25 }, { wch: 30 }, { wch: 50 }
    ]

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    return res.send(buffer)
  }

  // POST — импорт Excel
  if (req.method === 'POST') {
    const form = new IncomingForm({ keepExtensions: true })

    form.parse(req, async (err, fields, files: { file?: File | File[] }) => {
      const uploaded = files.file
      if (err || !uploaded || Array.isArray(uploaded)) {
        return res.status(400).json({ message: 'Ошибка загрузки файла' })
      }

      const filePath = uploaded.filepath
      const workbook = XLSX.read(fs.readFileSync(filePath))
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet)

      const parsed: Product[] = data.map(row => {
        const characteristics: { name: string; value: string }[] = []
        if (row['Характеристики']) {
          const parts = row['Характеристики'].split('|')
          for (const part of parts) {
            const [name, value] = part.trim().split(':')
            if (name && value) characteristics.push({ name: name.trim(), value: value.trim() })
          }
        }

        return {
          name: row['Название']?.toString() || '',
          price: Number(row['Цена']) || 0,
          quantity: Number(row['Количество']) || 0,
          category: row['Категория']?.toString() || '',
          link: row['Ссылка']?.toString() || '',
          image: row['Картинка']?.toString() || '',
          characteristics,
        }
      })

      await products.deleteMany({})
      await products.insertMany(parsed)

      return res.status(200).json({ message: 'Импорт завершён', count: parsed.length })
    })
    return
  }

  return res.status(405).end(`Метод ${req.method} не разрешён`)
}
export default withAuth(handler, { roles: ['admin'] })
