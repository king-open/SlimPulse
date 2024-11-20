export type AchievementCategory = 
  | 'check_in'    // 打卡相关
  | 'weight'      // 体重相关
  | 'exercise'    // 运动相关
  | 'diet'        // 饮食相关
  | 'social'      // 社交相关

export interface Achievement {
  id: string
  title: string
  description: string
  category: AchievementCategory
  icon: string
  condition: {
    type: string
    value: number
  }
  reward?: {
    type: string
    value: number
  }
  progress: number
  completed: boolean
  completedAt?: string
  level: number
  maxLevel: number
}

export interface AchievementProgress {
  userId: string
  achievementId: string
  currentValue: number
  level: number
  completed: boolean
  completedAt?: string
} 
