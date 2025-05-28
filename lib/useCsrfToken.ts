//lib/useCsrfToken.ts
import { useEffect, useState } from 'react'

export function useCsrfToken() {
  const [token, setToken] = useState<string>()

  useEffect(() => {
    fetch('/api/csrf', { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setToken(data.csrfToken))
      .catch(console.error)
  }, [])

  return token
}
