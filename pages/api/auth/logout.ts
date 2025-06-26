
import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

 export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
    

  res.setHeader(
    'Set-Cookie',
    serialize('token', '', {
      path: '/',
      maxAge: -1, // удаляет токен
    })
  )

  res.status(200).json({ message: 'Logged out' })
}
