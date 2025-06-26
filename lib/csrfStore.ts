// lib/csrfStore.ts

type StoreType = Map<string, string>

declare global {
  var __csrfStore: StoreType | undefined
}

const store: StoreType = global.__csrfStore ?? new Map()
if (!global.__csrfStore) {
  global.__csrfStore = store
}

export function saveCsrfToken(sessionId: string, token: string) {
  console.log(`💾 Сохраняем CSRF: sessionId=${sessionId}, token=${token}`)
  store.set(sessionId, token)
}

export function getCsrfToken(sessionId: string) {
  const token = store.get(sessionId)
  console.log(`🔎 Получаем CSRF: sessionId=${sessionId}, token=${token}`)
  return token
}

export function deleteCsrfToken(sessionId: string) {
  console.log(`❌ Удаляем CSRF: sessionId=${sessionId}`)
  store.delete(sessionId)
}
