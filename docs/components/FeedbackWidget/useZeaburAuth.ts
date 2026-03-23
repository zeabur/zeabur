import { useEffect, useState } from 'react'

export interface ZeaburUser {
  _id: string
  name: string
  username: string
  avatarURL: string
}

interface AuthState {
  user: ZeaburUser | null
  loading: boolean
}

function getTokenFromCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1]
}

export function useZeaburAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, loading: true })

  useEffect(() => {
    let cancelled = false

    const token = getTokenFromCookie()
    if (!token) {
      setState({ user: null, loading: false })
      return
    }

    fetch('https://api.zeabur.com/graphql', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: '{ me { _id name username avatarURL } }',
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return
        if (json.data?.me) {
          setState({ user: json.data.me, loading: false })
        } else {
          setState({ user: null, loading: false })
        }
      })
      .catch(() => {
        if (!cancelled) setState({ user: null, loading: false })
      })

    return () => { cancelled = true }
  }, [])

  return state
}
