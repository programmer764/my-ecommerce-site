// lib/auth.ts
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify, JWTPayload } from 'jose'

// обязательно в .env.local:
// JWT_SECRET=достаточно_длинная_случайная_строка
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined')
}
const JWT_SECRET = process.env.JWT_SECRET
const encoder   = new TextEncoder()
const secretKey = encoder.encode(JWT_SECRET)

/**
 * Хеширует пароль перед сохранением
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Сравнивает плейн-текст пароль и хеш
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Создаёт JWT HS256 c exp=7d
 */
export async function createToken(
  payload: Record<string, any>
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)
}

/**
 * Проверяет JWT (signature + exp) и возвращает payload
 */
interface TokenPayload extends JWTPayload {
  id: string
  email: string
  role: 'user' | 'admin'
}
export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET))
  return payload as TokenPayload
}

