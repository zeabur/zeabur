import { useEffect, useState } from 'react'

export interface ZeaburUser {
  _id: string
  username: string
  email: string
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

export function useZeaburAuth() {
  const [user, setUser] = useState<ZeaburUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getCookie('token')
    if (!token) {
      setLoading(false)
      return
    }

    fetch('https://api.zeabur.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: '{ me { _id username email } }',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.me) {
          setUser(data.data.me)
        }
      })
      .catch(() => {
        // ignore auth errors
      })
      .finally(() => setLoading(false))
  }, [])

  return { user, loading }
}
