// pages/api/csrf.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { randomBytes } from 'crypto'
import { serialize } from 'cookie'
import { saveCsrfToken } from '@/lib/csrfStore'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const csrfToken = randomBytes(32).toString('hex')
  const sessionId = randomBytes(16).toString('hex') // как ключ

  // Сохраняем токен в памяти (или Redis)
  saveCsrfToken(sessionId, csrfToken)

  // Ставим 2 HttpOnly куки: sessionId + csrfToken
  res.setHeader('Set-Cookie', [
    serialize('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    }),
    serialize('csrfToken', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    }),
  ])

  res.status(200).json({ ok: true })
}
