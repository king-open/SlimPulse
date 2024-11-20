import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { VerticalAlignTopOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.pageYOffset > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<VerticalAlignTopOutlined />}
            onClick={scrollToTop}
            className="shadow-lg"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BackToTop 
