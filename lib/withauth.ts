import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from './auth'

type Role = 'user' | 'admin'

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string
    email: string
    role: Role
  }
}

export function withAuth( handler: (req: AuthenticatedRequest, res: NextApiResponse) => any, options?: { roles?: Role[] })
: NextApiHandler {
  return async (req, res) => {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: 'Требуется авторизация' })
    }

    let user: AuthenticatedRequest['user']
    try {
      user = await verifyToken(token)
    } catch {
      return res.status(401).json({ message: 'Невалидный токен' })
    }

    if (options?.roles && !options.roles.includes(user.role)) {
      return res.status(403).json({ message: 'Недостаточно прав' })
    }

    (req as AuthenticatedRequest).user = user
    return handler(req as AuthenticatedRequest, res)
  }
}
