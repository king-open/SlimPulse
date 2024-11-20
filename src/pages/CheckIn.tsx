import React, { useState } from 'react'
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Divider,
  Upload,
  message,
  Row,
  Col,
  Typography,
  Steps,
  Progress,
  Tag,
} from 'antd'
import {
  PlusOutlined,
  CameraOutlined,
  DeleteOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
  CalendarOutlined,
  LineChartOutlined,
  InfoCircleOutlined,
  CoffeeOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  FireOutlined,
  ThunderboltOutlined,
  DashboardOutlined,
  HeartOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { useCheckIn } from '../hooks/useCheckIn'
import { MealType, ExerciseType, MoodType } from '../types'
import { motion } from 'framer-motion'
import { searchFoods, calculateMealCalories, recommendFoods } from '../services/foodDatabase'
import { calculateExerciseCalories, recommendExerciseDuration } from '../services/exerciseCalculator'
import { debounce } from '../utils/debounce'
import { achievementService } from '../services/achievementService'
import AchievementUnlock from '../components/achievements/AchievementUnlock'
import dayjs from 'dayjs'
import { useAppSelector } from '../store'
import BasicDataForm from '../components/forms/BasicDataForm'
import MealForm from '../components/forms/MealForm'
import ExerciseForm from '../components/forms/ExerciseForm'

const { Title, Text } = Typography
const { TextArea } = Input

const mealTypes: MealType[] = ['早餐', '午餐', '晚餐', '加餐']
const exerciseTypes: ExerciseType[] = ['跑步', '游泳', '骑行', '力量训练', '瑜伽', '其他']
const moodOptions = [
  { 
    value: 'great', 
    label: '😊',
    emoji: '😊',
    description: '很棒',
    color: '#52c41a',
    subEmojis: ['🥳', '🌟', '💪', '✨']
  },
  { 
    value: 'good', 
    label: '😃',
    emoji: '😃',
    description: '不错',
    color: '#1890ff',
    subEmojis: ['😄', '👍', '🎵', '☀️']
  },
  { 
    value: 'normal', 
    label: '😐',
    emoji: '😐',
    description: '一般',
    color: '#faad14',
    subEmojis: ['🤔', '😌', '💭', '🌤️']
  },
  { 
    value: 'tired', 
    label: '😫',
    emoji: '😫',
    description: '疲惫',
    color: '#ff7a45',
    subEmojis: ['🥱', '😪', '💤', '🌙']
  },
  { 
    value: 'stressed', 
    label: '😰',
    emoji: '😰',
    description: '压力大',
    color: '#ff4d4f',
    subEmojis: ['😓', '😖', '💦', '⚡']
  },
  { 
    value: 'bad', 
    label: '😢',
    emoji: '😢',
    description: '不好',
    color: '#ff4d4f',
    subEmojis: ['😔', '💔', '🌧️', '😞']
  },
]

interface ExerciseFormData {
  type: string
  duration: number
  calories: number
  intensity: keyof ExerciseIntensity
}

// 添加运动强度配置
const intensityOptions = [
  { 
    value: 'light',
    label: '低强度',
    color: 'blue',
    heartRate: '心率区间 1-2',
    description: '可以正常交谈，呼吸轻松'
  },
  { 
    value: 'moderate',
    label: '中等强度',
    color: 'green',
    heartRate: '心率区间 3-4',
    description: '说话时略有喘息，适度出汗'
  },
  { 
    value: 'vigorous',
    label: '高强度',
    color: 'red',
    heartRate: '心率区间 4-5',
    description: '呼吸急促，大量出汗'
  },
]

const CheckIn: React.FC = () => {
  const [form] = Form.useForm()
  const { submitCheckIn, loading, currentStreak } = useCheckIn()
  const [photoList, setPhotoList] = useState<string[]>([])
  const [foodSuggestions, setFoodSuggestions] = useState<FoodItem[]>([])
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null)

  // 获取用户信息
  const { user } = useAppSelector(state => state.user)
  const initialWeight = user?.weight || 0 // 从用户信息中获取初始体重

  const onFinish = async (values: any) => {
    try {
      const checkInData = {
        ...values,
        date: new Date().toISOString(),
        photos: photoList,
        totalCaloriesIn: values.meals.reduce((total: number, meal: any) => total + (meal.calories || 0), 0),
        totalCaloriesOut: values.exercises.reduce((total: number, exercise: any) => total + (exercise.calories || 0), 0),
      }
      
      await submitCheckIn(checkInData)
      
      // 检查是否解锁新成就
      const newAchievements = await achievementService.checkAchievements('current_user', {
        consecutiveDays: currentStreak + 1,
        weightLoss: checkInData.weight ? initialWeight - checkInData.weight : 0,
        exerciseCalories: checkInData.totalCaloriesOut,
      })

      // 如果有新解锁的成就，显示动画
      const firstNewAchievement = newAchievements.find(a => a.completed && !a.completedAt)
      if (firstNewAchievement) {
        setUnlockedAchievement(firstNewAchievement)
      }

      message.success('打卡成功！')
      form.resetFields()
      setPhotoList([])
    } catch (error) {
      message.error('打卡失败，请重试')
    }
  }

  const handlePhotoUpload = async (file: File) => {
    try {
      // 这里应该调用真实的上传API，现在只是模拟
      const fakeUrl = URL.createObjectURL(file)
      setPhotoList([...photoList, fakeUrl])
      return false // 阻止自动上传
    } catch (error) {
      message.error('图片上传失败')
      return false
    }
  }

  // 智能搜索食物
  const handleFoodSearch = debounce((value: string) => {
    const suggestions = searchFoods(value)
    setFoodSuggestions(suggestions)
  }, 300)

  // 自动计算卡路里
  const handleFoodSelect = (foods: string[], field: number) => {
    const calories = calculateMealCalories(foods)
    form.setFieldsValue({
      meals: form.getFieldValue('meals').map((meal: any, index: number) => 
        index === field ? { ...meal, foods, calories } : meal
      )
    })
  }

  // 修改运动消耗计算函数
  const handleExerciseChange = (type: string, duration: number, intensity: keyof ExerciseIntensity, field: number) => {
    const calories = calculateExerciseCalories(type, duration, intensity)
    form.setFieldsValue({
      exercises: form.getFieldValue('exercises').map((exercise: any, index: number) => 
        index === field ? { ...exercise, type, duration, calories } : exercise
      )
    })
  }

  // 获取推荐
  const getMealRecommendation = (type: MealType) => {
    const targetCalories = type === '早餐' ? 400 : type === '加餐' ? 200 : 600
    return recommendFoods(type, targetCalories)
  }

  const getExerciseRecommendation = (type: ExerciseType) => {
    const targetCalories = 300 // 每次运动建议消耗300卡路里
    return recommendExerciseDuration(type, targetCalories, 'moderate')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <div className="inline-block p-4 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10">
              <CalendarOutlined className="text-4xl text-primary" />
            </div>
          </motion.div>
          <Title level={2} className="mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              今日打卡
            </span>
          </Title>
          <Text type="secondary" className="text-base">
            记录今天的健康数据，保持良好的生活习惯
          </Text>
          
          <div className="mt-4 flex justify-center items-center space-x-8">
            <div className="text-center">
              <Text type="secondary">日期</Text>
              <div className="text-lg font-medium">
                {dayjs().format('YYYY-MM-DD')}
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <Text type="secondary">星期</Text>
              <div className="text-lg font-medium">
                {['日', '一', '二', '三', '四', '五', '六'][dayjs().day()]}
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <Text type="secondary">连续打卡</Text>
              <div className="text-lg font-medium text-primary">
                {currentStreak || 0} 天
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Steps
              size="small"
              current={1}
              className="max-w-md"
              items={[
                {
                  title: '基础数据',
                  description: '体重等',
                },
                {
                  title: '饮食记录',
                  description: '今日饮食',
                },
                {
                  title: '运动记录',
                  description: '运动情况',
                },
                {
                  title: '心情记录',
                  description: '今日心情',
                },
              ]}
            />
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            meals: [{ type: '早餐', foods: [], calories: 0 }],
            exercises: [{
              type: '跑步',
              duration: 30,
              calories: calculateExerciseCalories('跑步', 30, 'moderate')
            }],
            mood: 'good',
          }}
        >
          <BasicDataForm user={user} form={form} />
          
          <Divider>饮食记录</Divider>
          
          <MealForm
            form={form}
            foodSuggestions={foodSuggestions}
            onFoodSearch={handleFoodSearch}
            onFoodSelect={handleFoodSelect}
            getMealRecommendation={getMealRecommendation}
          />
          
          <Divider>运动记录</Divider>
          
          <ExerciseForm
            form={form}
            intensityOptions={intensityOptions}
            exerciseTypes={exerciseTypes}
            onExerciseChange={handleExerciseChange}
            getExerciseRecommendation={getExerciseRecommendation}
            calculateExerciseCalories={calculateExerciseCalories}
          />
          
          <Divider>心情与备注</Divider>

          <div className="bg-purple-50 rounded-xl p-6 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                <HeartOutlined className="text-lg text-purple-500" />
              </div>
              <Text strong className="text-lg">心情记录</Text>
            </div>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="flex items-center text-gray-600">
                      <SmileOutlined className="mr-1 text-pink-500" />
                      今日心情
                    </span>
                  }
                  name="mood"
                  rules={[{ required: true, message: '请选择心情' }]}
                >
                  <Select
                    size="large"
                    options={moodOptions.map(option => ({
                      value: option.value,
                      label: (
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{option.emoji}</span>
                            <span className="text-base" style={{ color: option.color }}>
                              {option.description}
                            </span>
                          </div>
                          <div className="text-gray-400 text-sm">
                            {option.subEmojis.join(' ')}
                          </div>
                        </div>
                      ),
                    }))}
                    optionLabelProp="label"
                    dropdownRender={menu => (
                      <div>
                        {menu}
                        <Divider className="my-2" />
                        <div className="px-3 pb-2 text-gray-500 text-sm">
                          选择一个最能代表今天心情的表情
                        </div>
                      </div>
                    )}
                  />
                </Form.Item>
                {form.getFieldValue('mood') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <div className="flex items-center justify-center space-x-2 text-2xl">
                      {moodOptions.find(m => m.value === form.getFieldValue('mood'))?.subEmojis.map((emoji, index) => (
                        <motion.span
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:scale-125 transition-transform cursor-pointer"
                        >
                          {emoji}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </Col>
              <Col span={12}>
                <Form.Item label="照片记录">
                  <Upload
                    listType="picture-card"
                    fileList={photoList.map((url, index) => ({
                      uid: `-${index}`,
                      name: `photo-${index}`,
                      status: 'done',
                      url,
                    }))}
                    beforeUpload={handlePhotoUpload}
                  >
                    {photoList.length >= 4 ? null : (
                      <div>
                        <CameraOutlined className="text-xl" />
                        <div className="mt-2">上传照片</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item 
              label={
                <span className="flex items-center text-gray-600">
                  <EditOutlined className="mr-1 text-blue-500" />
                  备注
                </span>
              } 
              name="notes"
            >
              <TextArea 
                rows={4} 
                placeholder="记录一下今天的感受..." 
                className="rounded-lg"
                showCount
                maxLength={200}
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              提交打卡
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <AchievementUnlock
        achievement={unlockedAchievement!}
        visible={!!unlockedAchievement}
        onClose={() => setUnlockedAchievement(null)}
      />
    </motion.div>
  )
}

export default CheckIn 
