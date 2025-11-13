import { useState, useCallback } from 'react'

interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [nextId, setNextId] = useState(1)

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = nextId
    setNextId(prev => prev + 1)
    setNotifications(prev => [...prev, { id, message, type }])
    
    // 自動で削除
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }, [nextId])

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return {
    notifications,
    showNotification,
    removeNotification,
  }
}

