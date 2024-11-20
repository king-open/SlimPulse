import { useAppDispatch, useAppSelector } from '../store'
import { updateProfile, uploadAvatar } from '../store/slices/userSlice'
import { User } from '../types'

export const useProfile = () => {
  const dispatch = useAppDispatch()
  const { profile, loading, error } = useAppSelector(state => state.user)

  const updateUserProfile = async (data: Partial<User>) => {
    await dispatch(updateProfile(data))
  }

  const updateAvatar = async (file: File) => {
    await dispatch(uploadAvatar(file))
  }

  return {
    profile,
    loading,
    error,
    updateProfile: updateUserProfile,
    uploadAvatar: updateAvatar,
  }
} 
