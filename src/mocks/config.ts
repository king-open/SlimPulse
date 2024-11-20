import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

let initMocks: () => Promise<void>

// 检查是否已经存在 Service Worker
if ('serviceWorker' in navigator) {
  // 生成 Service Worker
  const worker = setupWorker(...handlers)
  
  initMocks = async () => {
    try {
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      })
      console.log('[MSW] Mock Service Worker started')
    } catch (error) {
      console.error('[MSW] Failed to start:', error)
    }
  }
} else {
  initMocks = async () => {
    console.warn('[MSW] Service Worker is not supported in this environment')
  }
}

export { initMocks } 
