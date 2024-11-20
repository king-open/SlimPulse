import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi, LoginParams, RegisterParams } from '../../services/auth'
import { User } from '../../types'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (params: LoginParams) => {
    const response = await authApi.login(params)
    localStorage.setItem('token', response.token)
    return response
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (params: RegisterParams) => {
    const response = await authApi.register(params)
    localStorage.setItem('token', response.token)
    return response
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await authApi.logout()
    localStorage.removeItem('token')
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '登录失败'
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '注册失败'
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer 
