export interface ExerciseIntensity {
  light: number
  moderate: number
  vigorous: number
}

export const exerciseCaloriesPerMinute: Record<string, ExerciseIntensity> = {
  '跑步': {
    light: 8,
    moderate: 11,
    vigorous: 16,
  },
  '游泳': {
    light: 6,
    moderate: 8,
    vigorous: 10,
  },
  '骑行': {
    light: 5,
    moderate: 7,
    vigorous: 12,
  },
  '力量训练': {
    light: 3,
    moderate: 5,
    vigorous: 8,
  },
  '瑜伽': {
    light: 2,
    moderate: 3,
    vigorous: 4,
  },
}

export const calculateExerciseCalories = (
  exerciseType: string,
  duration: number,
  intensity: keyof ExerciseIntensity = 'moderate'
): number => {
  const exercise = exerciseCaloriesPerMinute[exerciseType]
  if (!exercise) return 0
  return Math.round(exercise[intensity] * duration)
}

export const recommendExerciseDuration = (
  exerciseType: string,
  targetCalories: number,
  intensity: keyof ExerciseIntensity = 'moderate'
): number => {
  const exercise = exerciseCaloriesPerMinute[exerciseType]
  if (!exercise) return 0
  return Math.ceil(targetCalories / exercise[intensity])
} 
