import React from 'react'
import { Card, List, Progress, Tag, Typography, Space } from 'antd'
import { 
  TrophyOutlined, 
  FireOutlined, 
  HeartOutlined, 
  TeamOutlined,
  AreaChartOutlined,
} from '@ant-design/icons'
import { Achievement, AchievementCategory } from '../../types/achievement'
import { motion } from 'framer-motion'

const { Text } = Typography

interface AchievementListProps {
  achievements: Achievement[]
  category?: AchievementCategory
}

const categoryIcons = {
  check_in: <TrophyOutlined className="text-yellow-500" />,
  weight: <AreaChartOutlined className="text-blue-500" />,
  exercise: <FireOutlined className="text-red-500" />,
  diet: <HeartOutlined className="text-pink-500" />,
  social: <TeamOutlined className="text-green-500" />,
}

const categoryColors = {
  check_in: 'gold',
  weight: 'blue',
  exercise: 'red',
  diet: 'pink',
  social: 'green',
}

const AchievementList: React.FC<AchievementListProps> = ({ 
  achievements,
  category,
}) => {
  const filteredAchievements = category 
    ? achievements.filter(a => a.category === category)
    : achievements

  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
      dataSource={filteredAchievements}
      renderItem={(achievement) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <List.Item>
            <Card
              hoverable
              className={`${achievement.completed ? 'bg-gray-50' : ''}`}
            >
              <Space direction="vertical" className="w-full">
                <div className="flex items-center justify-between">
                  {categoryIcons[achievement.category]}
                  <Tag color={categoryColors[achievement.category]}>
                    {achievement.category}
                  </Tag>
                </div>
                
                <Text strong className="text-lg">
                  {achievement.title}
                </Text>
                
                <Text type="secondary">
                  {achievement.description}
                </Text>
                
                <Progress
                  percent={Math.min(
                    (achievement.progress / achievement.condition.value) * 100,
                    100
                  )}
                  status={achievement.completed ? 'success' : 'active'}
                  format={(percent) => 
                    `${achievement.progress}/${achievement.condition.value}`
                  }
                />
                
                {achievement.reward && (
                  <div className="text-right">
                    <Tag color="gold">
                      奖励: {achievement.reward.value} 积分
                    </Tag>
                  </div>
                )}
                
                {achievement.completed && achievement.completedAt && (
                  <Text type="secondary" className="text-xs">
                    完成于: {new Date(achievement.completedAt).toLocaleDateString()}
                  </Text>
                )}
              </Space>
            </Card>
          </List.Item>
        </motion.div>
      )}
    />
  )
}

export default AchievementList 
