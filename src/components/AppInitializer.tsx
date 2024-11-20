import { useEffect } from 'react'
import { useNotification } from '../contexts/NotificationContext'
import { notificationService } from '../services/notification'

export const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notificationApi = useNotification()

  useEffect(() => {
    notificationService.setNotificationApi(notificationApi)
  }, [notificationApi])

  return <>{children}</>
} 
