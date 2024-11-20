import React from 'react'
import { List, Avatar, Badge, Tag } from 'antd'
import { motion } from 'framer-motion'
import { 
  LikeOutlined, 
  CommentOutlined, 
  UserAddOutlined,
  BellOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

export interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'system'
  content: string
  from: {
    id: string
    username: string
    avatar: string
  }
  postId?: string
  createdAt: string
  read: boolean
}

interface NotificationListProps {
  notifications: Notification[]
  onRead: (id: string) => Promise<void>
  onReadAll: () => Promise<void>
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onRead,
  onReadAll,
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <LikeOutlined className="text-red-500" />
      case 'comment':
        return <CommentOutlined className="text-blue-500" />
      case 'follow':
        return <UserAddOutlined className="text-green-500" />
      case 'system':
        return <BellOutlined className="text-yellow-500" />
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3>消息通知</h3>
        <Button type="link" onClick={onReadAll}>
          全部已读
        </Button>
      </div>

      <List
        dataSource={notifications}
        renderItem={(notification, index) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <List.Item
              onClick={() => onRead(notification.id)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={!notification.read}>
                    <Avatar src={notification.from.avatar} />
                  </Badge>
                }
                title={
                  <div className="flex items-center space-x-2">
                    <span>{notification.from.username}</span>
                    {getIcon(notification.type)}
                    <span className="text-gray-500 text-sm">
                      {dayjs(notification.createdAt).fromNow()}
                    </span>
                  </div>
                }
                description={notification.content}
              />
            </List.Item>
          </motion.div>
        )}
      />
    </div>
  )
}

export default NotificationList 
