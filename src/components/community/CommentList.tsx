import React from 'react'
import { List, Avatar, Input, Button } from 'antd'
import { motion } from 'framer-motion'
import { Comment as CommentType } from '../../types/community'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface CommentListProps {
  postId: string
  comments: CommentType[]
  onSubmit: (postId: string, content: string) => Promise<void>
  onLike: (commentId: string) => Promise<void>
}

const CommentList: React.FC<CommentListProps> = ({
  postId,
  comments,
  onSubmit,
  onLike,
}) => {
  const [content, setContent] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return
    
    try {
      setSubmitting(true)
      await onSubmit(postId, content)
      setContent('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input.TextArea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="写下你的评论..."
          autoSize={{ minRows: 2, maxRows: 6 }}
          className="flex-1"
        />
        <Button 
          type="primary"
          onClick={handleSubmit}
          loading={submitting}
        >
          发布
        </Button>
      </div>

      <List
        dataSource={comments}
        renderItem={(comment, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b border-gray-100 last:border-0 py-4"
          >
            <div className="flex items-start space-x-4">
              <Avatar src={comment.avatar} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{comment.username}</span>
                  <span className="text-gray-500 text-sm">
                    {dayjs(comment.createdAt).fromNow()}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{comment.content}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <Button 
                    type="text" 
                    size="small"
                    onClick={() => onLike(comment.id)}
                    className={comment.hasLiked ? 'text-primary' : ''}
                  >
                    {comment.hasLiked ? '取消点赞' : '点赞'} ({comment.likes})
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      />
    </div>
  )
}

export default CommentList 
