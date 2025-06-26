// lib/withCSRF.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { parse } from 'cookie'
import { getCsrfToken, deleteCsrfToken } from '@/lib/csrfStore'

export function withCSRF(handler: (req: NextApiRequest, res: NextApiResponse) => any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method || '')) {
      const cookies = req.headers.cookie ? parse(req.headers.cookie) : {}
      const sessionId = cookies.sessionId
      const csrfToken = cookies.csrfToken

      const expectedToken = sessionId ? getCsrfToken(sessionId) : null
      console.log('🔐 Проверка CSRF:')
      console.log('📥 Из запроса (куки):')
      console.log('  sessionId:', sessionId)
      console.log('  csrfToken :', csrfToken)
      console.log('📦 В хранилище:')
      console.log('  expectedToken:', expectedToken)

      if (!sessionId || !csrfToken || csrfToken !== expectedToken) {
        return res.status(408).json({ error: 'Неверный CSRF токен' })
      }
      

      // Можно удалить токен после использования (одноразовый)
      deleteCsrfToken(sessionId)
    }

    return handler(req, res)
  }
}
