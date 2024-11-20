import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import checkInReducer from './slices/checkInSlice'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    checkIn: checkInReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'auth/login/fulfilled',
          'auth/register/fulfilled',
          'checkIn/create/fulfilled',
        ],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector 
