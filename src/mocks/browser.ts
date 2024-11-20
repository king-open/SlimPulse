import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// 创建 worker 实例
export const worker = setupWorker(...handlers)

// 定义启动函数
export const startWorker = async () => {
  try {
    // 在开发环境下启动 worker
    if (process.env.NODE_ENV === 'development') {
      await worker.start({
        onUnhandledRequest: 'bypass', // 忽略未处理的请求
        quiet: true, // 减少控制台输出
        serviceWorker: {
          url: '/mockServiceWorker.js',
          options: {
            scope: '/',
          },
        },
      })
      console.log('[MSW] Mock Service Worker started')
    }
  } catch (error) {
    console.error('[MSW] Failed to start:', error)
  }
} 
