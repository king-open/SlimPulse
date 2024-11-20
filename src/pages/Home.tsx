import React from 'react'
import { Card, Row, Col, Button, Typography, Statistic, Progress } from 'antd'
import { useNavigate } from 'react-router-dom'
import { 
  CalendarOutlined, 
  LineChartOutlined, 
  TeamOutlined, 
  BookOutlined,
  PlusCircleOutlined,
  FireOutlined,
  TrophyOutlined,
  HeartOutlined,
} from '@ant-design/icons'
import { useCheckIn } from '../hooks/useCheckIn'
import { motion } from 'framer-motion'

const { Title, Paragraph } = Typography

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { stats, currentStreak } = useCheckIn()

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <motion.div
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 欢迎区域 */}
      <motion.div 
        className="text-center mb-12"
        variants={itemVariants}
      >
        <Title level={1} className="text-4xl font-bold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            健康生活，从打卡开始
          </span>
        </Title>
        <Paragraph className="text-lg text-gray-600 mb-8">
          记录每一天，见证最好的自己
        </Paragraph>
        <Button 
          type="primary" 
          size="large" 
          icon={<PlusCircleOutlined />}
          onClick={() => navigate('/checkin')}
          className="h-12 px-8 text-lg shadow-lg hover:scale-105 transform transition-all"
        >
          立即打卡
        </Button>
      </motion.div>

      {/* 统计卡片 */}
      <Row gutter={[24, 24]} className="mb-12">
        <Col xs={24} sm={8}>
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow">
              <Statistic
                title={<span className="text-lg">连续打卡</span>}
                value={currentStreak}
                suffix="天"
                prefix={<TrophyOutlined className="text-yellow-500" />}
                valueStyle={{ color: '#1890ff', fontSize: '2rem' }}
              />
              <Progress 
                percent={Math.min((currentStreak / 30) * 100, 100)} 
                showInfo={false}
                strokeColor={{ '0%': '#1890ff', '100%': '#52c41a' }}
              />
              <div className="text-gray-500 mt-2">距离下一个里程碑还差 {30 - (currentStreak % 30)} 天</div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={8}>
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow">
              <Statistic
                title={<span className="text-lg">累计打卡</span>}
                value={stats.totalCheckIns}
                suffix="次"
                prefix={<CalendarOutlined className="text-blue-500" />}
                valueStyle={{ color: '#52c41a', fontSize: '2rem' }}
              />
              <div className="mt-4">
                <Progress 
                  type="circle" 
                  percent={Math.min((stats.totalCheckIns / 100) * 100, 100)} 
                  size={80}
                  strokeColor={{ '0%': '#52c41a', '100%': '#1890ff' }}
                />
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={8}>
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow">
              <Statistic
                title={<span className="text-lg">今日消耗</span>}
                value={stats.caloriesTrend[0]?.out || 0}
                suffix="千卡"
                prefix={<FireOutlined className="text-red-500" />}
                valueStyle={{ color: '#f5222d', fontSize: '2rem' }}
              />
              <div className="flex items-center justify-between mt-4">
                <span>目标消耗</span>
                <Progress 
                  percent={Math.min(((stats.caloriesTrend[0]?.out || 0) / 2000) * 100, 100)} 
                  steps={5} 
                  strokeColor="#f5222d"
                  size="small"
                />
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 功能卡片 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card 
              hoverable 
              className="text-center transform hover:scale-105 transition-all"
              onClick={() => navigate('/dashboard')}
              cover={
                <div className="pt-8 pb-4 bg-gradient-to-br from-blue-50 to-green-50">
                  <CalendarOutlined className="text-5xl text-primary" />
                </div>
              }
            >
              <Card.Meta
                title={<Title level={4}>打卡统计</Title>}
                description="查看你的健康数据"
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card 
              hoverable 
              className="text-center transform hover:scale-105 transition-all"
              onClick={() => navigate('/profile')}
              cover={
                <div className="pt-8 pb-4 bg-gradient-to-br from-purple-50 to-pink-50">
                  <HeartOutlined className="text-5xl text-blue-500" />
                </div>
              }
            >
              <Card.Meta
                title={<Title level={4}>个人中心</Title>}
                description="管理你的账号信息"
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card 
              hoverable 
              className="text-center transform hover:scale-105 transition-all"
              onClick={() => navigate('/community')}
              cover={
                <div className="pt-8 pb-4 bg-gradient-to-br from-yellow-50 to-red-50">
                  <TeamOutlined className="text-5xl text-green-500" />
                </div>
              }
            >
              <Card.Meta
                title={<Title level={4}>社区</Title>}
                description="与伙伴一起进步"
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card 
              hoverable 
              className="text-center transform hover:scale-105 transition-all"
              onClick={() => navigate('/knowledge')}
              cover={
                <div className="pt-8 pb-4 bg-gradient-to-br from-green-50 to-blue-50">
                  <BookOutlined className="text-5xl text-purple-500" />
                </div>
              }
            >
              <Card.Meta
                title={<Title level={4}>知识库</Title>}
                description="获取专业的建议"
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 提示卡片 */}
      <motion.div 
        variants={itemVariants}
        className="mt-12"
      >
        <Card className="bg-gradient-to-r from-primary-50 to-blue-50 border-none">
          <div className="flex items-center justify-between">
            <div>
              <Title level={4} className="mb-2">每日小贴士</Title>
              <Paragraph className="mb-0">
                坚持记录是一种习惯，让我们一起培养健康的生活方式。
              </Paragraph>
            </div>
            <Button type="primary" ghost onClick={() => navigate('/knowledge')}>
              了解更多
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default Home 
