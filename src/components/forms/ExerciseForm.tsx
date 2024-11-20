import React from 'react'
import { Form, Input, Select, InputNumber, Button, Card, Row, Col, Tag, Typography } from 'antd'
import { 
  ThunderboltOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  FireOutlined,
  DeleteOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  HeartOutlined,
} from '@ant-design/icons'
import { ExerciseType, ExerciseIntensity } from '../../types'
import type { FormInstance } from 'antd/es/form'

const { Text } = Typography

interface ExerciseFormProps {
  form: FormInstance
  intensityOptions: Array<{
    value: keyof ExerciseIntensity
    label: string
    color: string
    heartRate: string
    description: string
  }>
  exerciseTypes: ExerciseType[]
  onExerciseChange: (type: string, duration: number, intensity: keyof ExerciseIntensity, field: number) => void
  getExerciseRecommendation: (type: ExerciseType) => number
  calculateExerciseCalories: (type: string, duration: number, intensity: keyof ExerciseIntensity) => number
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  form,
  intensityOptions,
  exerciseTypes,
  onExerciseChange,
  getExerciseRecommendation,
  calculateExerciseCalories,
}) => {
  return (
    <div className="bg-green-50 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
            <ThunderboltOutlined className="text-lg text-green-500" />
          </div>
          <Text strong className="text-lg">运动记录</Text>
        </div>
        <Tag color="green" className="px-3 py-1">
          <FireOutlined className="mr-1" />
          今日消耗: {Form.useWatch('exercises', form)?.reduce((total: number, exercise: any) => total + (exercise.calories || 0), 0) || 0} 千卡
        </Tag>
      </div>

      <Form.List name="exercises">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card 
                key={key} 
                className="mb-4 shadow-sm hover:shadow-md transition-all border-l-4 border-l-green-500"
                styles={{ body: { padding: '16px' } }}
              >
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item
                      name={[name, 'type']}
                      label={
                        <span className="flex items-center text-gray-600">
                          <ThunderboltOutlined className="mr-1 text-green-500" />
                          运动类型
                        </span>
                      }
                      rules={[{ required: true, message: '请选择运动类型' }]}
                      {...restField}
                    >
                      <Select
                        options={exerciseTypes.map(type => ({ 
                          label: (
                            <div className="flex items-center">
                              <span className="mr-2">{type}</span>
                              {type === '跑步' && <ThunderboltOutlined className="text-yellow-500" />}
                              {type === '游泳' && <i className="i-carbon-swim ~text-blue-500" />}
                              {type === '骑行' && <i className="i-carbon-bicycle ~text-green-500" />}
                              {type === '力量训练' && <i className="i-carbon-gym ~text-red-500" />}
                              {type === '瑜伽' && <i className="i-carbon-person-yoga ~text-purple-500" />}
                            </div>
                          ), 
                          value: type 
                        }))}
                        onChange={(value) => {
                          const recommendedDuration = getExerciseRecommendation(value as ExerciseType)
                          form.setFieldsValue({
                            exercises: form.getFieldValue('exercises').map((exercise: any, i: number) => 
                              i === name ? { 
                                ...exercise, 
                                type: value, 
                                duration: recommendedDuration,
                                calories: calculateExerciseCalories(value, recommendedDuration, exercise.intensity || 'moderate')
                              } : exercise
                            )
                          })
                        }}
                        className="w-full"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name={[name, 'duration']}
                      label={
                        <span className="flex items-center text-gray-600">
                          <ClockCircleOutlined className="mr-1 text-blue-500" />
                          时长
                        </span>
                      }
                      rules={[{ required: true, message: '请输入运动时长' }]}
                      {...restField}
                    >
                      <InputNumber
                        min={1}
                        className="w-full"
                        addonAfter="分钟"
                        controls
                        keyboard
                        onChange={(value) => {
                          if (value) {
                            const type = form.getFieldValue(['exercises', name, 'type'])
                            const intensity = form.getFieldValue(['exercises', name, 'intensity']) || 'moderate'
                            onExerciseChange(type, value, intensity, name)
                          }
                        }}
                      />
                    </Form.Item>
                    <div className="mt-1">
                      <Text type="secondary" className="text-xs">
                        建议时长: 30-60分钟
                      </Text>
                    </div>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name={[name, 'intensity']}
                      label={
                        <span className="flex items-center text-gray-600">
                          <DashboardOutlined className="mr-1 text-orange-500" />
                          强度
                        </span>
                      }
                      initialValue="moderate"
                      rules={[{ required: true, message: '请选择运动强度' }]}
                      {...restField}
                    >
                      <Select
                        options={intensityOptions.map(option => ({
                          value: option.value,
                          label: (
                            <div className="flex items-center gap-2 w-[400px]">
                              <Tag color={option.color} className="min-w-[60px] text-center">
                                {option.label}
                              </Tag>
                              <div className="flex flex-col flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600 text-sm">
                                    {option.heartRate}
                                  </span>
                                  <span className="text-gray-400 text-xs">
                                    {option.description}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ),
                        }))}
                        onChange={(value) => {
                          const type = form.getFieldValue(['exercises', name, 'type'])
                          const duration = form.getFieldValue(['exercises', name, 'duration'])
                          if (type && duration) {
                            onExerciseChange(type, duration, value, name)
                          }
                        }}
                        popupMatchSelectWidth={false}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name={[name, 'calories']}
                      label={
                        <span className="flex items-center text-gray-600">
                          <FireOutlined className="mr-1 text-red-500" />
                          消耗
                        </span>
                      }
                      {...restField}
                    >
                      <div className="relative">
                        <InputNumber
                          min={0}
                          className="w-full"
                          readOnly
                          formatter={(value) => `${value} 千卡`}
                          prefix={<FireOutlined className="text-red-500" />}
                        />
                        <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                          <Tag 
                            color={form.getFieldValue(['exercises', name, 'calories']) > 300 ? 'success' : 'warning'}
                            className="m-0"
                          >
                            {form.getFieldValue(['exercises', name, 'calories']) > 300 ? '达标' : '未达标'}
                          </Tag>
                        </div>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
                {fields.length > 1 && (
                  <Button
                    type="text"
                    onClick={() => remove(name)}
                    icon={<DeleteOutlined />}
                    danger
                    className="absolute -top-3 right-2 bg-white shadow-sm hover:shadow-md transition-shadow"
                  />
                )}
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() => add({
                type: '跑步',
                duration: 30,
                intensity: 'moderate',
                calories: calculateExerciseCalories('跑步', 30, 'moderate')
              })}
              block
              icon={<PlusOutlined />}
              className="mb-4"
            >
              添加运动记录
            </Button>

            {/* 添加运动建议 */}
            <div className="mt-4 p-3 bg-green-100/50 rounded-lg">
              <Text type="secondary" className="text-sm">
                <InfoCircleOutlined className="mr-2" />
                建议每天进行30-60分钟中等强度运动，每周运动3-5次。运动时注意循序渐进，避免过度。
              </Text>
            </div>
          </>
        )}
      </Form.List>
    </div>
  )
}

export default ExerciseForm 
