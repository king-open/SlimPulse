import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { User } from '../../types'
import api from '../../services/api'

interface UserState {
  profile: User | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
}

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: Partial<User>) => {
    const response = await api.patch<User>('/user/profile', data)
    return response.data
  }
)

export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await api.post<{ avatarUrl: string }>('/user/avatar', formData)
    return response.data.avatarUrl
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload
    },
    clearProfile: (state) => {
      state.profile = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '更新失败'
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.avatar = action.payload
        }
      })
  },
})

export const { setProfile, clearProfile } = userSlice.actions
export default userSlice.reducer 
