import React, { useState } from 'react'
import { Card, Avatar, Button, Space, Typography, Tag, Image } from 'antd'
import { 
  LikeOutlined, 
  LikeFilled,
  CommentOutlined,
  FireOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { Post } from '../../types/community'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import CommentList from './CommentList'
import { usePosts } from '../../hooks/usePosts'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Text, Paragraph } = Typography

interface PostListProps {
  posts: Post[]
  onLike: (postId: string) => void
  onComment: (postId: string, content: string) => Promise<void>
  onLikeComment: (commentId: string) => Promise<void>
}

const PostList: React.FC<PostListProps> = ({ 
  posts, 
  onLike,
  onComment,
  onLikeComment,
}) => {
  const [expandedComments, setExpandedComments] = useState<string[]>([])
  const { comments, getComments } = usePosts()

  const handleToggleComments = async (postId: string) => {
    if (!expandedComments.includes(postId)) {
      await getComments(postId)
    }
    setExpandedComments(prev => 
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card hoverable className="overflow-hidden">
            <div className="flex items-start">
              <Avatar src={post.avatar} size={40} className="mr-4" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Text strong className="mr-2">{post.username}</Text>
                    <Text type="secondary" className="text-sm">
                      {dayjs(post.createdAt).fromNow()}
                    </Text>
                  </div>
                  {post.checkInData && (
                    <Tag color="success">打卡分享</Tag>
                  )}
                </div>

                <Paragraph>{post.content}</Paragraph>

                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <Image.PreviewGroup>
                      {post.images.map((image, idx) => (
                        <div key={idx} className="aspect-w-4 aspect-h-3">
                          <Image
                            src={image}
                            alt={`图片 ${idx + 1}`}
                            className="object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            style={{ height: '200px', width: '100%' }}
                            preview={{
                              mask: (
                                <div className="flex items-center justify-center text-white">
                                  <div className="text-lg">查看大图</div>
                                </div>
                              ),
                            }}
                          />
                        </div>
                      ))}
                    </Image.PreviewGroup>
                  </div>
                )}

                {post.checkInData && (
                  <Card size="small" className="mb-4 bg-gray-50">
                    {post.checkInData.weight && (
                      <div className="mb-2">
                        <Tag color="processing">今日体重</Tag>
                        <Text>{post.checkInData.weight} kg</Text>
                      </div>
                    )}
                    {post.checkInData.exercises && post.checkInData.exercises.length > 0 && (
                      <div>
                        <Tag color="success">运动记录</Tag>
                        <div className="mt-2">
                          {post.checkInData.exercises.map((exercise, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600 mb-1">
                              <ThunderboltOutlined className="mr-1" />
                              <span>{exercise.type}</span>
                              <span className="mx-1">·</span>
                              <span>{exercise.duration}分钟</span>
                              <span className="mx-1">·</span>
                              <FireOutlined className="mr-1 text-red-500" />
                              <span>{exercise.calories}千卡</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                )}

                <div className="flex items-center justify-between">
                  <Space>
                    <Button
                      type="text"
                      icon={post.hasLiked ? <LikeFilled className="text-primary" /> : <LikeOutlined />}
                      onClick={() => onLike(post.id)}
                      className={post.hasLiked ? 'text-primary' : ''}
                    >
                      {post.likes}
                    </Button>
                    <Button
                      type="text"
                      icon={<CommentOutlined />}
                      onClick={() => handleToggleComments(post.id)}
                    >
                      {post.comments}
                    </Button>
                  </Space>
                </div>

                {/* 评论区 */}
                {expandedComments.includes(post.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t"
                  >
                    <CommentList
                      postId={post.id}
                      comments={comments[post.id] || []}
                      onSubmit={onComment}
                      onLike={onLikeComment}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default PostList 
