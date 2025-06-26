import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongo'
import { verifyToken } from '@/lib/auth'
import { sendConfirmationEmail } from '@/lib/mail'
import crypto from 'crypto'
import { z, ZodError } from 'zod'
import { withCSRF } from '@/lib/withCSRF'
// --- Валидация с zod ---
const OrderItemSchema = z.object({
  cartId: z.string(),
  name: z.string(),
  price: z.number().min(0).nullable(),
  quantity: z.number().int().positive(),
  image: z.string(),
  link: z.string().url(),
  category: z.string(),
  characteristics: z.array(z.any()), // Лучше уточнить структуру
  createdAt: z.string(), // Или z.coerce.date()
  categorySlug: z.string(),  
  
})

const OrderInputSchema = z.object({
  email: z.string().email('Некорректный email'),
  items: z.array(OrderItemSchema).nonempty('Корзина не может быть пустой'),
  total: z.number().min(0, 'Сумма должна быть положительной'),
})

type OrderInput = z.infer<typeof OrderInputSchema>

// --- Обработчик ---
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end('Method Not Allowed')
  }

  const origin = req.headers.origin || ''
  if (origin !== process.env.CSRF_ALLOWED_ORIGIN) {
    return res.status(403).json({ message: 'Запрещено: неверный origin' })
  }

  // Проверка токена
  let user: { id: string; email: string; role?: string } | null = null
  const token = req.cookies.token
  if (token) {
    try {
      user = await verifyToken(token)
    } catch {
      user = null
    }
  }

  // Валидация тела запроса
  let orderInput: OrderInput
  try {
    orderInput = OrderInputSchema.parse(req.body)
  } catch (err) {
    if (err instanceof ZodError) {
      console.error('❌ Ошибка валидации Zod:')
      err.errors.forEach((e, index) => {
        console.error(
          `#${index + 1}: [${e.path.join('.')}] - ${e.message}`
        )
      })
      return res.status(400).json({
        message: 'Ошибка валидации данных',
        details: err.errors.map(e => ({
          path: e.path,
          message: e.message,
        })),
      })
    }

    console.error('❌ Неизвестная ошибка при валидации:', err)
    return res.status(400).json({ message: 'Неверные данные' })
  }

  const client = await clientPromise
  const orders = client.db('dbcom').collection('orders')

  const baseOrder = {
    email: user?.email || orderInput.email,
    items: orderInput.items,
    total: orderInput.total,
    status: 'новый',
    createdAt: new Date(),
  }

  if (user) {
    await orders.insertOne({
      ...baseOrder,
      confirmed: true,
      userId: user.id,
    })
    return res.status(201).json({ message: 'Заказ создан и подтверждён' })
  }

  const confirmationToken = crypto.randomBytes(16).toString('hex')

  await orders.insertOne({
    ...baseOrder,
    confirmed: false,
    confirmationToken,
  })

  try {
    await sendConfirmationEmail(orderInput.email, confirmationToken)
  } catch (err) {
    console.error('Ошибка отправки письма:', err)
  }

  return res.status(200).json({ message: 'Подтвердите заказ по ссылке в письме' })
}
export default (withCSRF(handler))