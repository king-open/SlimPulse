export interface User {
  id: string
  username: string
  email: string
  phone?: string
  avatar?: string
  weight?: number
  targetWeight?: number
  targetDate?: string
  membershipType: 'free' | 'premium'
}

export type MealType = '早餐' | '午餐' | '晚餐' | '加餐'
export type ExerciseType = '跑步' | '游泳' | '骑行' | '力量训练' | '瑜伽' | '其他'
export type MoodType = 'great' | 'good' | 'normal' | 'bad'

export interface Meal {
  type: MealType
  foods: string[]
  calories: number
  photos?: string[]
}

export interface Exercise {
  type: ExerciseType
  duration: number
  calories: number
  notes?: string
}

export interface CheckIn {
  id: string
  userId: string
  date: string
  weight?: number
  bodyFat?: number
  waistline?: number
  meals: Meal[]
  exercises: Exercise[]
  mood: MoodType
  notes?: string
  photos?: string[]
  totalCaloriesIn: number
  totalCaloriesOut: number
}

export interface CheckInStats {
  streakDays: number
  totalCheckIns: number
  averageWeight?: number
  weightTrend: Array<{
    date: string
    value: number
  }>
  caloriesTrend: Array<{
    date: string
    in: number
    out: number
  }>
}

export interface ExerciseIntensity {
  light: string
  moderate: string
  vigorous: string
} 
