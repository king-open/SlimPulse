import React from 'react'
import { Card, Progress, Row, Col, Statistic, Typography } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { CheckIn } from '../../types'
import dayjs from 'dayjs'

const { Title, Text } = Typography

interface GoalAnalysisProps {
  records: CheckIn[]
  targetWeight?: number
  targetDate?: string
}

const GoalAnalysis: React.FC<GoalAnalysisProps> = ({ 
  records, 
  targetWeight = 0,
  targetDate,
}) => {
  const latestWeight = records[0]?.weight || 0
  const initialWeight = records[records.length - 1]?.weight || latestWeight
  const weightDiff = initialWeight - latestWeight
  const weightProgress = targetWeight ? 
    Math.min(Math.abs(weightDiff / (initialWeight - targetWeight) * 100), 100) : 0

  const averageCaloriesDeficit = records.reduce((total, record) => 
    total + (record.totalCaloriesOut - record.totalCaloriesIn), 0) / records.length

  const daysToTarget = targetDate ? 
    dayjs(targetDate).diff(dayjs(), 'day') : 0

  const projectedWeight = latestWeight - (averageCaloriesDeficit * daysToTarget / 7700)

  return (
    <Card>
      <Title level={4}>目标达成分析</Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card>
            <Statistic
              title="当前进度"
              value={weightProgress}
              precision={1}
              suffix="%"
              prefix={weightDiff > 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
              valueStyle={{ color: weightDiff > 0 ? '#3f8600' : '#cf1322' }}
            />
            <Progress 
              percent={weightProgress} 
              status={weightProgress >= 100 ? 'success' : 'active'}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="预计达成时间"
              value={daysToTarget}
              suffix="天"
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary">
              预计达到 {projectedWeight.toFixed(1)} kg
            </Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="初始体重"
              value={initialWeight}
              precision={1}
              suffix="kg"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="当前体重"
              value={latestWeight}
              precision={1}
              suffix="kg"
              valueStyle={{ color: weightDiff > 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="目标体重"
              value={targetWeight}
              precision={1}
              suffix="kg"
            />
          </Card>
        </Col>
      </Row>
    </Card>
  )
}

export default GoalAnalysis 
