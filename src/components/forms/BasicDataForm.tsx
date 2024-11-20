import React from 'react'
import { Form, InputNumber, Row, Col, Tag, Typography, Progress } from 'antd'
import { LineChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { User } from '../../types'
import type { FormInstance } from 'antd/es/form'

const { Text } = Typography

interface BasicDataFormProps {
  user: User | null
  form: FormInstance
}

const BasicDataForm: React.FC<BasicDataFormProps> = ({ user, form }) => {
  const weight = Form.useWatch('weight', form)
  const bodyFat = Form.useWatch('bodyFat', form)
  const waistline = Form.useWatch('waistline', form)

  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
          <LineChartOutlined className="text-lg text-primary" />
        </div>
        <Text strong className="text-lg">基础数据</Text>
      </div>

      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            label={
              <div className="flex items-center justify-between">
                <span>体重</span>
                {weight && (
                  <Tag 
                    color={weight > (user?.weight || 0) ? 'error' : 'success'}
                    className="ml-2"
                  >
                    {weight > (user?.weight || 0) ? '增重' : '减重'} 
                    {Math.abs(weight - (user?.weight || 0)).toFixed(1)} kg
                  </Tag>
                )}
              </div>
            }
            name="weight"
            rules={[{ required: true, message: '请输入体重' }]}
          >
            <InputNumber
              min={30}
              max={200}
              step={0.1}
              precision={1}
              className="w-full"
              controls
              keyboard
              addonAfter="kg"
              placeholder="输入当前体重"
            />
          </Form.Item>
          {user?.targetWeight && (
            <div className="mt-2">
              <Progress 
                percent={Math.min(
                  Math.abs(
                    ((weight || user.weight || 0) - user.weight) / 
                    (user.targetWeight - user.weight)
                  ) * 100,
                  100
                )}
                size="small"
                status={weight <= user.targetWeight ? 'success' : 'exception'}
                format={() => `目标: ${user.targetWeight}kg`}
              />
            </div>
          )}
        </Col>

        <Col span={8}>
          <Form.Item 
            label={
              <div className="flex items-center justify-between">
                <span>体脂率</span>
                {bodyFat && (
                  <Tag 
                    color={bodyFat > (user?.bodyFat || 0) ? 'error' : 'success'}
                    className="ml-2"
                  >
                    {bodyFat > (user?.bodyFat || 0) ? '增加' : '减少'} 
                    {Math.abs(bodyFat - (user?.bodyFat || 0)).toFixed(1)}%
                  </Tag>
                )}
              </div>
            }
            name="bodyFat"
            tooltip="体脂率是指人体内脂肪重量在人体总体重中所占的比例"
          >
            <InputNumber
              min={1}
              max={50}
              step={0.1}
              precision={1}
              className="w-full"
              controls
              keyboard
              addonAfter="%"
              placeholder="输入体脂率"
            />
          </Form.Item>
          <div className="mt-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>偏瘦: {'<'}15%</span>
              <span>标准: 15-25%</span>
              <span>偏胖: {'>'}25%</span>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <Form.Item 
            label={
              <div className="flex items-center justify-between">
                <span>腰围</span>
                {waistline && (
                  <Tag 
                    color={waistline > (user?.waistline || 0) ? 'error' : 'success'}
                    className="ml-2"
                  >
                    {waistline > (user?.waistline || 0) ? '增加' : '减少'} 
                    {Math.abs(waistline - (user?.waistline || 0)).toFixed(1)} cm
                  </Tag>
                )}
              </div>
            }
            name="waistline"
            tooltip="腰围是评估中心性肥胖的重要指标"
          >
            <InputNumber
              min={40}
              max={200}
              step={0.1}
              precision={1}
              className="w-full"
              controls
              keyboard
              addonAfter="cm"
              placeholder="输入腰围"
            />
          </Form.Item>
          <div className="mt-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>男性标准: {'<'}85cm</span>
              <span>女性标准: {'<'}80cm</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* 添加健康提示 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <Text type="secondary" className="text-sm">
          <InfoCircleOutlined className="mr-2" />
          记录身体数据可以帮助你更好地了解自己的健康状况，建议每天固定时间测量。
        </Text>
      </div>
    </div>
  )
}

export default BasicDataForm 
