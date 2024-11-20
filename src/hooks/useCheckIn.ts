import { useAppDispatch, useAppSelector } from '../store'
import { createCheckIn, fetchCheckIns, calculateStreak } from '../store/slices/checkInSlice'
import { CheckIn } from '../types'

export const useCheckIn = () => {
  const dispatch = useAppDispatch()
  const { records, stats, currentStreak, loading, error } = useAppSelector(state => state.checkIn)

  const submitCheckIn = async (data: Omit<CheckIn, 'id' | 'userId'>) => {
    try {
      await dispatch(createCheckIn(data)).unwrap()
      dispatch(calculateStreak())
    } catch (err) {
      console.error('打卡失败:', err)
      throw err
    }
  }

  const loadCheckIns = async () => {
    try {
      await dispatch(fetchCheckIns()).unwrap()
      dispatch(calculateStreak())
    } catch (err) {
      console.error('加载打卡记录失败:', err)
      throw err
    }
  }

  return {
    records,
    stats,
    currentStreak,
    loading,
    error,
    submitCheckIn,
    loadCheckIns,
  }
} 
