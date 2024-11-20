import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { communityService } from '../../services/communityService'
import type { Topic, UserRelation, Notification } from '../../types/community'

interface SocialState {
  topics: Topic[]
  following: string[]
  followers: string[]
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
}

const initialState: SocialState = {
  topics: [],
  following: [],
  followers: [],
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
}

// Async actions
export const fetchTopics = createAsyncThunk(
  'social/fetchTopics',
  async () => {
    const response = await communityService.getTopics()
    return response
  }
)

export const followTopic = createAsyncThunk(
  'social/followTopic',
  async (topicId: string) => {
    await communityService.followTopic(topicId)
    return topicId
  }
)

export const followUser = createAsyncThunk(
  'social/followUser',
  async (userId: string) => {
    await communityService.followUser(userId)
    return userId
  }
)

export const fetchNotifications = createAsyncThunk(
  'social/fetchNotifications',
  async () => {
    const response = await communityService.getNotifications()
    return response
  }
)

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.isRead) {
        notification.isRead = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    clearUnreadCount: (state) => {
      state.unreadCount = 0
      state.notifications.forEach(n => n.isRead = true)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.topics = action.payload
      })
      .addCase(followTopic.fulfilled, (state, action) => {
        const topic = state.topics.find(t => t.id === action.payload)
        if (topic) {
          topic.isFollowing = true
          topic.followerCount += 1
        }
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.following.push(action.payload)
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload
        state.unreadCount = action.payload.filter(n => !n.isRead).length
      })
  },
})

export const { markNotificationAsRead, clearUnreadCount } = socialSlice.actions
export default socialSlice.reducer 
