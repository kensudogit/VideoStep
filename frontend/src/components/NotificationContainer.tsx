'use client'

import { useNotification } from '@/hooks/useNotification'
import NotificationToast from './NotificationToast'

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <NotificationToast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          isVisible={true}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

