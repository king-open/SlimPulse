import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { login, register, logout } from '../store/slices/authSlice'
import { setProfile } from '../store/slices/userSlice'
import type { LoginParams, RegisterParams } from '../services/auth'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, token, loading, error } = useSelector((state: RootState) => state.auth)

  const handleLogin = async (params: LoginParams) => {
    const result = await dispatch(login(params)).unwrap()
    // 登录成功后，设置用户信息到 userSlice
    dispatch(setProfile(result.user))
    return result
  }

  const handleRegister = async (params: RegisterParams) => {
    const result = await dispatch(register(params)).unwrap()
    // 注册成功后，设置用户信息到 userSlice
    dispatch(setProfile(result.user))
    return result
  }

  const handleLogout = async () => {
    await dispatch(logout())
    // 清除用户信息
    dispatch(setProfile(null))
  }

  return {
    user,
    token,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  }
} 
