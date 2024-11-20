import React, { createContext, useContext } from 'react'
import { notification } from 'antd'
import type { NotificationInstance } from 'antd/es/notification/interface'

const NotificationContext = createContext<NotificationInstance | null>(null)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification()

  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const notificationApi = useContext(NotificationContext)
  if (!notificationApi) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return notificationApi
} 
