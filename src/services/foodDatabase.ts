export interface FoodItem {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  unit: string
  portion: number
}

// 模拟食物数据库
export const foodDatabase: Record<string, FoodItem> = {
  '鸡胸肉': {
    name: '鸡胸肉',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    unit: '克',
    portion: 100
  },
  '全麦面包': {
    name: '全麦面包',
    calories: 247,
    protein: 13,
    carbs: 41,
    fat: 3.4,
    unit: '片',
    portion: 100
  },
  '牛奶': {
    name: '牛奶',
    calories: 42,
    protein: 3.4,
    carbs: 5,
    fat: 1.5,
    unit: '毫升',
    portion: 100
  },
  // ... 更多食物数据
}

export const searchFoods = (keyword: string): FoodItem[] => {
  return Object.values(foodDatabase).filter(food => 
    food.name.toLowerCase().includes(keyword.toLowerCase())
  )
}

export const calculateMealCalories = (foods: string[]): number => {
  return foods.reduce((total, food) => {
    const foodItem = foodDatabase[food]
    return total + (foodItem?.calories || 0)
  }, 0)
}

export const recommendFoods = (mealType: string, targetCalories: number): FoodItem[] => {
  const mealRecommendations: Record<string, string[]> = {
    '早餐': ['全麦面包', '牛奶', '鸡蛋'],
    '午餐': ['鸡胸肉', '糙米饭', '西兰花'],
    '晚餐': ['三文鱼', '藜麦', '菠菜'],
    '加餐': ['香蕉', '酸奶', '坚果'],
  }

  const recommendedFoods = mealRecommendations[mealType] || []
  return recommendedFoods
    .map(name => foodDatabase[name])
    .filter(food => food && food.calories <= targetCalories)
} 
