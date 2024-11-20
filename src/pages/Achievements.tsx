import React, { useEffect, useState } from 'react'
import { Card, Tabs, Statistic, Row, Col, Typography } from 'antd'
import { TrophyOutlined, StarOutlined } from '@ant-design/icons'
import { Achievement, AchievementCategory } from '../types/achievement'
import { achievementService } from '../services/achievementService'
import AchievementList from '../components/achievements/AchievementList'
import { motion } from 'framer-motion'

const { Title } = Typography

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    points: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [achievementsData, statsData] = await Promise.all([
          achievementService.getUserAchievements('current_user'),
          achievementService.getAchievementStats('current_user'),
        ])
        setAchievements(achievementsData)
        setStats(statsData)
      } catch (error) {
        console.error('Failed to load achievements:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const categories: { key: AchievementCategory; label: string }[] = [
    { key: 'check_in', label: '打卡成就' },
    { key: 'weight', label: '体重成就' },
    { key: 'exercise', label: '运动成就' },
    { key: 'diet', label: '饮食成就' },
    { key: 'social', label: '社交成就' },
  ]

  return (
    <div className="space-y-6">
      <Title level={2}>我的成就</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <Statistic
                title="已完成成就"
                value={stats.completed}
                suffix={`/ ${stats.total}`}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <Statistic
                title="完成度"
                value={(stats.completed / stats.total) * 100}
                precision={1}
                suffix="%"
                prefix={<StarOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <Statistic
                title="获得积分"
                value={stats.points}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Card>
        <Tabs
          defaultActiveKey="all"
          items={[
            {
              key: 'all',
              label: '全部成就',
              children: <AchievementList achievements={achievements} />,
            },
            ...categories.map(category => ({
              key: category.key,
              label: category.label,
              children: (
                <AchievementList
                  achievements={achievements}
                  category={category.key}
                />
              ),
            })),
          ]}
        />
      </Card>
    </div>
  )
}

export default Achievements 
