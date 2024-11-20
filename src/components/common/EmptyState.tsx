import React from 'react'
import { Empty, Button } from 'antd'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  title?: string
  description?: string
  image?: string
  action?: {
    text: string
    onClick: () => void
  }
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = '暂无数据',
  description = '这里空空如也，快来添加一些内容吧',
  image,
  action,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-12"
    >
      <Empty
        image={image || Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="space-y-2">
            <div className="text-lg font-medium">{title}</div>
            <div className="text-gray-500">{description}</div>
          </div>
        }
      >
        {action && (
          <Button type="primary" onClick={action.onClick}>
            {action.text}
          </Button>
        )}
      </Empty>
    </motion.div>
  )
}

export default EmptyState 
