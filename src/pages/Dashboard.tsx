import React from 'react'
import { Card, Row, Col, Statistic, Progress, Typography, Calendar, Badge, Button, Dropdown, Space, Tag } from 'antd'
import { 
  FireOutlined, 
  TrophyOutlined, 
  LineChartOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  FilterOutlined,
  RiseOutlined,
  FallOutlined,
  ThunderboltOutlined,
  HeartOutlined,
} from '@ant-design/icons'
import { useCheckIn } from '../hooks/useCheckIn'
import StatisticsCharts from '../components/charts/StatisticsCharts'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { exportService } from '../services/exportService'
import GoalAnalysis from '../components/charts/GoalAnalysis'
import DataFilter from '../components/filters/DataFilter'

const { Title, Text } = Typography

const Dashboard: React.FC = () => {
  const { stats, records, currentStreak } = useCheckIn()

  // 计算月度统计
  const monthlyStats = React.useMemo(() => {
    const now = dayjs()
    const monthRecords = records.filter(record => 
      dayjs(record.date).month() === now.month()
    )

    const lastMonthRecords = records.filter(record => 
      dayjs(record.date).month() === now.subtract(1, 'month').month()
    )

    const averageCaloriesIn = monthRecords.reduce((sum, record) => sum + record.totalCaloriesIn, 0) / monthRecords.length || 0
    const lastMonthCaloriesIn = lastMonthRecords.reduce((sum, record) => sum + record.totalCaloriesIn, 0) / lastMonthRecords.length || 0
    const caloriesInTrend = ((averageCaloriesIn - lastMonthCaloriesIn) / lastMonthCaloriesIn) * 100

    const averageCaloriesOut = monthRecords.reduce((sum, record) => sum + record.totalCaloriesOut, 0) / monthRecords.length || 0
    const lastMonthCaloriesOut = lastMonthRecords.reduce((sum, record) => sum + record.totalCaloriesOut, 0) / lastMonthRecords.length || 0
    const caloriesOutTrend = ((averageCaloriesOut - lastMonthCaloriesOut) / lastMonthCaloriesOut) * 100

    return {
      totalCheckIns: monthRecords.length,
      averageCaloriesIn,
      averageCaloriesOut,
      caloriesInTrend,
      caloriesOutTrend,
    }
  }, [records])

  // 日历单元格渲染
  const dateCellRender = (date: dayjs.Dayjs) => {
    const record = records.find(r => dayjs(r.date).isSame(date, 'day'))
    if (!record) return null

    return (
      <div className="calendar-events space-y-1">
        {record.totalCaloriesIn > 0 && (
          <Tag color="error" className="w-full text-center">
            摄入 {record.totalCaloriesIn}千卡
          </Tag>
        )}
        {record.totalCaloriesOut > 0 && (
          <Tag color="success" className="w-full text-center">
            消耗 {record.totalCaloriesOut}千卡
          </Tag>
        )}
        {record.weight && (
          <Tag color="processing" className="w-full text-center">
            体重 {record.weight}kg
          </Tag>
        )}
      </div>
    )
  }

  const exportItems = [
    {
      key: 'excel',
      label: '导出为 Excel',
      onClick: () => exportService.exportToExcel(records),
    },
    {
      key: 'json',
      label: '导出为 JSON',
      onClick: () => exportService.exportToJSON(records),
    },
    {
      key: 'csv',
      label: '导出为 CSV',
      onClick: () => exportService.exportToCSV(records),
    },
  ]

  const handleFilter = (values: any) => {
    // 实现筛选逻辑
    console.log('Filter values:', values)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Title level={2} className="mb-2">打卡统计</Title>
          <Text type="secondary">记录你的健康数据，见证每一天的进步</Text>
        </div>
        <Space>
          <Button icon={<FilterOutlined />} onClick={() => {}}>
            筛选
          </Button>
          <Dropdown menu={{ items: exportItems }}>
            <Button type="primary" icon={<DownloadOutlined />}>
              导出数据
            </Button>
          </Dropdown>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card hoverable className="h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                    <TrophyOutlined className="text-xl text-blue-500" />
                  </div>
                  <div>
                    <Text type="secondary">连续打卡</Text>
                    <div className="text-2xl font-bold">{currentStreak}天</div>
                  </div>
                </div>
                <ThunderboltOutlined className="text-yellow-500 text-xl" />
              </div>
              <Progress 
                percent={Math.min((currentStreak / 30) * 100, 100)} 
                showInfo={false}
                strokeColor={{ '0%': '#1890ff', '100%': '#52c41a' }}
                className="mb-2"
              />
              <Text type="secondary" className="text-sm">
                距离下一个里程碑还差 {30 - (currentStreak % 30)} 天
              </Text>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card hoverable className="h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mr-3">
                    <CheckCircleOutlined className="text-xl text-green-500" />
                  </div>
                  <div>
                    <Text type="secondary">本月打卡</Text>
                    <div className="text-2xl font-bold">{monthlyStats.totalCheckIns}次</div>
                  </div>
                </div>
                <HeartOutlined className="text-red-500 text-xl" />
              </div>
              <Progress 
                percent={Math.min((monthlyStats.totalCheckIns / 30) * 100, 100)} 
                showInfo={false}
                strokeColor={{ '0%': '#52c41a', '100%': '#1890ff' }}
                className="mb-2"
              />
              <Text type="secondary" className="text-sm">
                月度目标完成度 {Math.round((monthlyStats.totalCheckIns / 30) * 100)}%
              </Text>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card hoverable className="h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mr-3">
                    <FireOutlined className="text-xl text-red-500" />
                  </div>
                  <div>
                    <Text type="secondary">平均摄入</Text>
                    <div className="text-2xl font-bold">{Math.round(monthlyStats.averageCaloriesIn)}千卡</div>
                  </div>
                </div>
                {monthlyStats.caloriesInTrend > 0 ? (
                  <RiseOutlined className="text-red-500 text-xl" />
                ) : (
                  <FallOutlined className="text-green-500 text-xl" />
                )}
              </div>
              <Progress 
                percent={Math.min((monthlyStats.averageCaloriesIn / 2000) * 100, 100)} 
                showInfo={false}
                strokeColor={{ '0%': '#ff4d4f', '100%': '#ffa39e' }}
                className="mb-2"
              />
              <Text type="secondary" className="text-sm">
                较上月
                <Text type={monthlyStats.caloriesInTrend > 0 ? 'danger' : 'success'}>
                  {' '}{monthlyStats.caloriesInTrend > 0 ? '↑' : '↓'} {Math.abs(Math.round(monthlyStats.caloriesInTrend))}%
                </Text>
              </Text>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card hoverable className="h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mr-3">
                    <LineChartOutlined className="text-xl text-purple-500" />
                  </div>
                  <div>
                    <Text type="secondary">平均消耗</Text>
                    <div className="text-2xl font-bold">{Math.round(monthlyStats.averageCaloriesOut)}千卡</div>
                  </div>
                </div>
                {monthlyStats.caloriesOutTrend > 0 ? (
                  <RiseOutlined className="text-green-500 text-xl" />
                ) : (
                  <FallOutlined className="text-red-500 text-xl" />
                )}
              </div>
              <Progress 
                percent={Math.min((monthlyStats.averageCaloriesOut / 1000) * 100, 100)} 
                showInfo={false}
                strokeColor={{ '0%': '#1890ff', '100%': '#52c41a' }}
                className="mb-2"
              />
              <Text type="secondary" className="text-sm">
                较上月
                <Text type={monthlyStats.caloriesOutTrend > 0 ? 'success' : 'danger'}>
                  {' '}{monthlyStats.caloriesOutTrend > 0 ? '↑' : '↓'} {Math.abs(Math.round(monthlyStats.caloriesOutTrend))}%
                </Text>
              </Text>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 目标分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GoalAnalysis 
          records={records}
          targetWeight={65}
          targetDate="2024-12-31"
        />
      </motion.div>

      {/* 图表区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <StatisticsCharts />
      </motion.div>

      {/* 日历视图 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <Calendar 
            cellRender={dateCellRender}
            className="custom-calendar"
          />
        </Card>
      </motion.div>
    </div>
  )
}

export default Dashboard 
