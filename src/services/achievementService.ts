import { Achievement, AchievementCategory } from '../types/achievement'
import { TrophyOutlined, FireOutlined, HeartOutlined, TeamOutlined } from '@ant-design/icons'

// 成就定义
export const achievements: Achievement[] = [
  // 打卡成就
  {
    id: 'consecutive_check_in_3',
    title: '初心者',
    description: '连续打卡3天',
    category: 'check_in',
    icon: 'TrophyOutlined',
    condition: { type: 'consecutive_days', value: 3 },
    reward: { type: 'points', value: 100 },
    progress: 0,
    completed: false,
    level: 1,
    maxLevel: 1,
  },
  {
    id: 'consecutive_check_in_7',
    title: '坚持一周',
    description: '连续打卡7天',
    category: 'check_in',
    icon: 'TrophyOutlined',
    condition: { type: 'consecutive_days', value: 7 },
    reward: { type: 'points', value: 300 },
    progress: 0,
    completed: false,
    level: 1,
    maxLevel: 1,
  },
  {
    id: 'consecutive_check_in_30',
    title: '月度达人',
    description: '连续打卡30天',
    category: 'check_in',
    icon: 'TrophyOutlined',
    condition: { type: 'consecutive_days', value: 30 },
    reward: { type: 'points', value: 1000 },
    progress: 0,
    completed: false,
    level: 1,
    maxLevel: 1,
  },
  
  // 体重成就
  {
    id: 'weight_loss_5',
    title: '初见成效',
    description: '总体重减少5公斤',
    category: 'weight',
    icon: 'ScaleOutlined',
    condition: { type: 'weight_loss', value: 5 },
    reward: { type: 'points', value: 500 },
    progress: 0,
    completed: false,
    level: 1,
    maxLevel: 3,
  },
  
  // 运动成就
  {
    id: 'exercise_calories_1000',
    title: '运动健将',
    description: '单日运动消耗1000卡路里',
    category: 'exercise',
    icon: 'FireOutlined',
    condition: { type: 'daily_exercise_calories', value: 1000 },
    reward: { type: 'points', value: 200 },
    progress: 0,
    completed: false,
    level: 1,
    maxLevel: 5,
  },
  
  // 饮食成就
  {
    id: 'diet_balance',
    title: '营养均衡',
    description: '连续7天保持营养均衡',
    category: 'diet',
    icon: 'HeartOutlined',
    condition: { type: 'balanced_diet_days', value: 7 },
    reward: { type: 'points', value: 300 },
    progress: 0,
    completed: false,
    level: 1,
    maxLevel: 3,
  },
  
  // 社交成就
  {
    id: 'social_likes_100',
    title: '人气之星',
    description: '获得100个点赞',
    category: 'social',
    icon: 'TeamOutlined',
    condition: { type: 'total_likes', value: 100 },
    reward: { type: 'points', value: 200 },
    progress: 0,
    completed: false,
    level: 1,
    maxLevel: 5,
  },
]

class AchievementService {
  // 检查并更新成就进度
  async checkAchievements(userId: string, data: any) {
    const updates: Achievement[] = []
    
    // 检查连续打卡
    if (data.consecutiveDays) {
      updates.push(...this.checkConsecutiveDays(data.consecutiveDays))
    }
    
    // 检查体重变化
    if (data.weightLoss) {
      updates.push(...this.checkWeightLoss(data.weightLoss))
    }
    
    // 检查运动消耗
    if (data.exerciseCalories) {
      updates.push(...this.checkExerciseCalories(data.exerciseCalories))
    }
    
    // 更新成就状态
    await this.updateAchievements(userId, updates)
    
    // 返回新完成的成就
    return updates.filter(a => a.completed && !a.completedAt)
  }
  
  // 检查连续打卡成就
  private checkConsecutiveDays(days: number): Achievement[] {
    return achievements
      .filter(a => a.category === 'check_in' && !a.completed)
      .map(a => ({
        ...a,
        progress: days,
        completed: days >= a.condition.value,
        completedAt: days >= a.condition.value ? new Date().toISOString() : undefined,
      }))
  }
  
  // 检查体重变化成就
  private checkWeightLoss(loss: number): Achievement[] {
    return achievements
      .filter(a => a.category === 'weight' && !a.completed)
      .map(a => ({
        ...a,
        progress: loss,
        completed: loss >= a.condition.value,
        completedAt: loss >= a.condition.value ? new Date().toISOString() : undefined,
      }))
  }
  
  // 检查运动消耗成就
  private checkExerciseCalories(calories: number): Achievement[] {
    return achievements
      .filter(a => a.category === 'exercise' && !a.completed)
      .map(a => ({
        ...a,
        progress: calories,
        completed: calories >= a.condition.value,
        completedAt: calories >= a.condition.value ? new Date().toISOString() : undefined,
      }))
  }
  
  // 更新成就状态
  private async updateAchievements(userId: string, achievements: Achievement[]) {
    // 这里应该调用API更新数据库
    // 现在只是模拟
    console.log('Updating achievements for user:', userId, achievements)
  }
  
  // 获取用户成就列表
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    // 这里应该从API获取数据
    // 现在返回模拟数据
    return achievements
  }
  
  // 获取成就统计
  async getAchievementStats(userId: string) {
    const userAchievements = await this.getUserAchievements(userId)
    return {
      total: userAchievements.length,
      completed: userAchievements.filter(a => a.completed).length,
      points: userAchievements
        .filter(a => a.completed && a.reward)
        .reduce((sum, a) => sum + (a.reward?.value || 0), 0),
    }
  }
}

export const achievementService = new AchievementService() 
