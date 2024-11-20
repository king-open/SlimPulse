import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { CheckIn, CheckInStats } from '../../types'

interface CheckInState {
  records: CheckIn[]
  stats: CheckInStats
  currentStreak: number
  loading: boolean
  error: string | null
}

const initialState: CheckInState = {
  records: [],
  stats: {
    streakDays: 0,
    totalCheckIns: 0,
    weightTrend: [],
    caloriesTrend: [],
  },
  currentStreak: 0,
  loading: false,
  error: null,
}

// 模拟API调用
const mockApi = {
  createCheckIn: async (data: Omit<CheckIn, 'id' | 'userId'>): Promise<CheckIn> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      id: `checkin_${Date.now()}`,
      userId: 'current_user',
      ...data,
    }
  },
  getCheckIns: async (): Promise<CheckIn[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return []
  },
  getStats: async (): Promise<CheckInStats> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return initialState.stats
  },
}

export const createCheckIn = createAsyncThunk(
  'checkIn/create',
  async (data: Omit<CheckIn, 'id' | 'userId'>) => {
    const response = await mockApi.createCheckIn(data)
    return response
  }
)

export const fetchCheckIns = createAsyncThunk(
  'checkIn/fetchAll',
  async () => {
    const response = await mockApi.getCheckIns()
    return response
  }
)

export const fetchStats = createAsyncThunk(
  'checkIn/fetchStats',
  async () => {
    const response = await mockApi.getStats()
    return response
  }
)

const checkInSlice = createSlice({
  name: 'checkIn',
  initialState,
  reducers: {
    calculateStreak: (state) => {
      // 按日期排序打卡记录
      const sortedRecords = [...state.records].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      
      let streak = 0
      let currentDate = new Date()
      
      for (const record of sortedRecords) {
        const recordDate = new Date(record.date)
        const diffDays = Math.floor(
          (currentDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        
        if (diffDays <= 1) {
          streak++
          currentDate = recordDate
        } else {
          break
        }
      }
      
      state.currentStreak = streak
      state.stats.streakDays = streak
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckIn.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCheckIn.fulfilled, (state, action) => {
        state.loading = false
        state.records.unshift(action.payload)
        state.stats.totalCheckIns += 1
      })
      .addCase(createCheckIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '打卡失败'
      })
      .addCase(fetchCheckIns.fulfilled, (state, action) => {
        state.records = action.payload
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
  },
})

export const { calculateStreak } = checkInSlice.actions
export default checkInSlice.reducer 
