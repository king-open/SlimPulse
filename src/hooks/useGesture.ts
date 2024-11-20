import { useEffect, useRef } from 'react'

interface GestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
}

export const useGesture = (options: GestureOptions) => {
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const threshold = options.threshold || 50

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return

      const deltaX = e.changedTouches[0].clientX - touchStart.current.x
      const deltaY = e.changedTouches[0].clientY - touchStart.current.y

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0 && options.onSwipeRight) {
            options.onSwipeRight()
          } else if (deltaX < 0 && options.onSwipeLeft) {
            options.onSwipeLeft()
          }
        }
      } else {
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0 && options.onSwipeDown) {
            options.onSwipeDown()
          } else if (deltaY < 0 && options.onSwipeUp) {
            options.onSwipeUp()
          }
        }
      }

      touchStart.current = null
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [options, threshold])
} 
