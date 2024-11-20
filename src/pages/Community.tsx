import React, { useState } from 'react'
import { Card, Input, Button, Tabs, Select, Empty, Spin, Typography, Space, Tag } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FireOutlined, 
  RiseOutlined, 
  TeamOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  HeartOutlined,
} from '@ant-design/icons'
import PostList from '../components/community/PostList'
import PostEditor from '../components/community/PostEditor'
import TopicTags from '../components/community/TopicTags'
import { Post } from '../types/community'
import { usePosts } from '../hooks/usePosts'

const { Search } = Input
const { Title, Text } = Typography

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest')
  const { 
    posts, 
    loading, 
    error, 
    createPost, 
    likePost,
    addComment,
    likeComment,
  } = usePosts()

  const filteredPosts = React.useMemo(() => {
    let result = [...posts]
    
    // 根据标签筛选
    if (activeTab !== 'all') {
      result = result.filter(post => {
        switch (activeTab) {
          case 'exercise':
            return post.checkInData?.exercises?.length > 0
          case 'weight':
            return post.checkInData?.weight !== undefined
          default:
            return true
        }
      })
    }
    
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(post => 
        post.content.toLowerCase().includes(query) ||
        post.username.toLowerCase().includes(query)
      )
    }
    
    // 排序
    result.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else {
        return b.likes - a.likes
      }
    })
    
    return result
  }, [posts, activeTab, searchQuery, sortBy])

  const handleCreatePost = async (content: string, images?: string[]) => {
    await createPost({ content, images })
  }

  const handleLike = async (postId: string) => {
    await likePost(postId)
  }

  const handleComment = async (postId: string, content: string) => {
    await addComment(postId, content)
  }

  const handleLikeComment = async (commentId: string) => {
    await likeComment(commentId)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <div className="inline-block p-4 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10">
            <TeamOutlined className="text-4xl text-primary" />
          </div>
        </motion.div>
        <Title level={2} className="mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            健康社区
          </span>
        </Title>
        <Text type="secondary" className="text-base">
          分享你的健康生活，与伙伴一起进步
        </Text>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card hoverable className="text-center">
            <FireOutlined className="text-2xl text-red-500 mb-2" />
            <div className="text-lg font-bold">{posts.length}</div>
            <div className="text-gray-500">今日动态</div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card hoverable className="text-center">
            <RiseOutlined className="text-2xl text-green-500 mb-2" />
            <div className="text-lg font-bold">
              {posts.reduce((sum, post) => sum + post.likes, 0)}
            </div>
            <div className="text-gray-500">收获点赞</div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card hoverable className="text-center">
            <TeamOutlined className="text-2xl text-blue-500 mb-2" />
            <div className="text-lg font-bold">
              {posts.reduce((sum, post) => sum + post.comments, 0)}
            </div>
            <div className="text-gray-500">互动评论</div>
          </Card>
        </motion.div>
      </div>

      {/* 发布动态卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="mb-6 shadow-sm hover:shadow-md transition-shadow">
          <PostEditor onSubmit={handleCreatePost} />
        </Card>
      </motion.div>

      {/* 热门话题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <Card title={
          <div className="flex items-center">
            <FireOutlined className="text-red-500 mr-2" />
            <span>热门话题</span>
          </div>
        }>
          <TopicTags
            topics={[
              { id: '1', name: '减肥打卡', count: 128 },
              { id: '2', name: '健身日记', count: 89 },
              { id: '3', name: '饮食分享', count: 56 },
              { id: '4', name: '运动技巧', count: 34 },
            ]}
            selectedTopics={[]}
            onSelect={() => {}}
            onDeselect={() => {}}
          />
        </Card>
      </motion.div>

      {/* 筛选和搜索栏 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-6"
      >
        <Card>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                { 
                  key: 'all', 
                  label: (
                    <Space>
                      <TeamOutlined />
                      全部
                    </Space>
                  )
                },
                { 
                  key: 'exercise', 
                  label: (
                    <Space>
                      <ThunderboltOutlined />
                      运动
                    </Space>
                  )
                },
                { 
                  key: 'weight', 
                  label: (
                    <Space>
                      <HeartOutlined />
                      体重
                    </Space>
                  )
                },
              ]}
            />

            <Space>
              <Search
                placeholder="搜索动态"
                allowClear
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: 200 }}
              />
              
              <Select
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { 
                    value: 'latest', 
                    label: (
                      <Space>
                        <SortAscendingOutlined />
                        最新
                      </Space>
                    )
                  },
                  { 
                    value: 'popular', 
                    label: (
                      <Space>
                        <FireOutlined />
                        最热
                      </Space>
                    )
                  },
                ]}
                style={{ width: 120 }}
              />
            </Space>
          </div>
        </Card>
      </motion.div>

      {/* 动态列表 */}
      <Spin spinning={loading}>
        <AnimatePresence mode="wait">
          {filteredPosts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.7 }}
            >
              <PostList 
                posts={filteredPosts}
                onLike={handleLike}
                onComment={handleComment}
                onLikeComment={handleLikeComment}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <Empty 
                description="暂无动态" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  发布第一条动态
                </Button>
              </Empty>
            </motion.div>
          )}
        </AnimatePresence>
      </Spin>
    </div>
  )
}

export default Community 
