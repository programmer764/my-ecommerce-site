// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const adminRoutes = ['/admin', '/api/products/adminapi']
const userRoutes  = ['/api/cart']

export const config = {
  matcher: ['/admin/:path*', '/api/products/adminapi', '/api/cart/:path*','/api/products/bulk','/api/products/import'],
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('token')?.value

  // если нет токена — редирект на логин
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // дешифруем payload без await
  let user: { role?: string }
  try {
    const [, payloadB64] = token.split('.')
    const payloadJson = Buffer.from(payloadB64, 'base64').toString('utf-8')
    user = JSON.parse(payloadJson)
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // админ-пути
  if (adminRoutes.some(r => pathname.startsWith(r))) {
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // защищённые для любого залогиненного
  if (userRoutes.some(r => pathname.startsWith(r))) {
    // если дошли сюда — токен валидный по структуре, пускаем дальше
  }

  return NextResponse.next()
}
