import React from 'react'
import { Form, Input, Select, InputNumber, Button, Card, Row, Col, Tag, Typography } from 'antd'
import { 
  CoffeeOutlined, 
  ClockCircleOutlined, 
  AppstoreOutlined, 
  FireOutlined,
  DeleteOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { MealType, FoodItem } from '../../types'
import type { FormInstance } from 'antd/es/form'

const { Text } = Typography

interface MealFormProps {
  form: FormInstance
  foodSuggestions: FoodItem[]
  onFoodSearch: (value: string) => void
  onFoodSelect: (foods: string[], field: number) => void
  getMealRecommendation: (type: MealType) => void
}

const MealForm: React.FC<MealFormProps> = ({
  form,
  foodSuggestions,
  onFoodSearch,
  onFoodSelect,
  getMealRecommendation,
}) => {
  const meals = Form.useWatch('meals', form)

  return (
    <div className="bg-orange-50 rounded-xl p-6 mb-8">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
          <CoffeeOutlined className="text-lg text-orange-500" />
        </div>
        <Text strong className="text-lg">饮食记录</Text>
      </div>

      <Form.List name="meals">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card 
                key={key} 
                className="mb-4 shadow-sm hover:shadow-md transition-shadow"
                styles={{ body: { padding: '16px' } }}
              >
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item
                      name={[name, 'type']}
                      label={
                        <span className="flex items-center">
                          <ClockCircleOutlined className="mr-1 text-gray-400" />
                          餐类
                        </span>
                      }
                      rules={[{ required: true, message: '请选择餐类' }]}
                      {...restField}
                    >
                      <Select
                        options={['早餐', '午餐', '晚餐', '加餐'].map(type => ({ 
                          label: type, 
                          value: type,
                        }))}
                        onChange={(value) => getMealRecommendation(value as MealType)}
                        className="w-full"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={[name, 'foods']}
                      label={
                        <span className="flex items-center">
                          <AppstoreOutlined className="mr-1 text-gray-400" />
                          食物
                        </span>
                      }
                      rules={[{ required: true, message: '请输入食物' }]}
                      {...restField}
                    >
                      <Select
                        mode="tags"
                        placeholder="输入食物名称，回车添加"
                        onChange={(values) => onFoodSelect(values, name)}
                        onSearch={onFoodSearch}
                        options={foodSuggestions.map(food => ({
                          label: (
                            <div className="flex justify-between items-center">
                              <span>{food.name}</span>
                              <span className="text-gray-400 text-sm">
                                {food.calories}千卡/{food.portion}{food.unit}
                              </span>
                            </div>
                          ),
                          value: food.name,
                        }))}
                        className="w-full"
                        maxTagCount={3}
                      />
                    </Form.Item>
                    {meals?.[name]?.foods?.length > 0 && (
                      <div className="mt-2">
                        {meals[name].foods.map((food: string) => {
                          const foodInfo = foodSuggestions.find(f => f.name === food)
                          return foodInfo && (
                            <Tag 
                              key={food}
                              color="orange"
                              className="mb-1 mr-1"
                            >
                              {food} ({foodInfo.calories}千卡)
                            </Tag>
                          )
                        })}
                      </div>
                    )}
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name={[name, 'calories']}
                      label={
                        <span className="flex items-center">
                          <FireOutlined className="mr-1 text-gray-400" />
                          卡路里
                        </span>
                      }
                      {...restField}
                    >
                      <InputNumber
                        min={0}
                        className="w-full"
                        readOnly
                        formatter={(value) => `${value} 千卡`}
                        prefix={<FireOutlined className="text-red-500" />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                {fields.length > 1 && (
                  <Button
                    type="text"
                    onClick={() => remove(name)}
                    icon={<DeleteOutlined />}
                    danger
                    className="absolute top-4 right-4"
                  >
                    删除
                  </Button>
                )}
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
              className="mb-4"
            >
              添加餐食记录
            </Button>

            {/* 添加营养建议 */}
            <div className="mt-4 p-3 bg-orange-100/50 rounded-lg">
              <Text type="secondary" className="text-sm">
                <InfoCircleOutlined className="mr-2" />
                建议每天摄入2000千卡左右，早餐400千卡，午餐和晚餐各600千卡，零食不超过400千卡。
              </Text>
            </div>
          </>
        )}
      </Form.List>
    </div>
  )
}

export default MealForm 
