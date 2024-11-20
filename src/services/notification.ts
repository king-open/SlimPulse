import { message } from 'antd'
import type { NotificationInstance } from 'antd/es/notification/interface'

class NotificationService {
  private static instance: NotificationService
  private notificationApi: NotificationInstance | null = null

  private constructor() {}

  static getInstance() {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  setNotificationApi(api: NotificationInstance) {
    this.notificationApi = api
  }

  success(msg: string, description?: string) {
    if (this.notificationApi) {
      this.notificationApi.success({
        message: msg,
        description,
        placement: 'topRight',
      })
    } else {
      message.success(msg)
    }
  }

  error(msg: string, description?: string) {
    if (this.notificationApi) {
      this.notificationApi.error({
        message: msg,
        description,
        placement: 'topRight',
      })
    } else {
      message.error(msg)
    }
  }

  info(msg: string, description?: string) {
    if (this.notificationApi) {
      this.notificationApi.info({
        message: msg,
        description,
        placement: 'topRight',
      })
    } else {
      message.info(msg)
    }
  }

  checkInReminder() {
    if (this.notificationApi) {
      this.notificationApi.info({
        message: '打卡提醒',
        description: '别忘了今天的健康打卡哦！',
        placement: 'topRight',
        duration: 0,
      })
    }
  }
}

export const notificationService = NotificationService.getInstance() 
