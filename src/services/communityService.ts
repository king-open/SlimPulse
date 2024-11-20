import api from './api'
import type { 
  Post, 
  Comment, 
  Topic, 
  UserRelation, 
  Notification,
  Report,
  ContentStatus 
} from '../types/community'

export const communityService = {
  // 话题相关
  async getTopics() {
    return api.get<Topic[]>('/api/topics')
  },

  async createTopic(data: { name: string; description: string }) {
    return api.post<Topic>('/api/topics', data)
  },

  async followTopic(topicId: string) {
    return api.post(`/api/topics/${topicId}/follow`)
  },

  async unfollowTopic(topicId: string) {
    return api.post(`/api/topics/${topicId}/unfollow`)
  },

  // 用户关系相关
  async followUser(userId: string) {
    return api.post<UserRelation>(`/api/users/${userId}/follow`)
  },

  async unfollowUser(userId: string) {
    return api.delete(`/api/users/${userId}/follow`)
  },

  async getFollowers(userId: string) {
    return api.get<UserRelation[]>(`/api/users/${userId}/followers`)
  },

  async getFollowing(userId: string) {
    return api.get<UserRelation[]>(`/api/users/${userId}/following`)
  },

  // 内容收藏
  async collectPost(postId: string) {
    return api.post(`/api/posts/${postId}/collect`)
  },

  async uncollectPost(postId: string) {
    return api.delete(`/api/posts/${postId}/collect`)
  },

  async getCollections(userId: string) {
    return api.get<Post[]>(`/api/users/${userId}/collections`)
  },

  // 内容分享
  async sharePost(postId: string, platform: string) {
    return api.post(`/api/posts/${postId}/share`, { platform })
  },

  // 内容审核
  async reportContent(data: {
    targetType: 'post' | 'comment'
    targetId: string
    reason: string
    description?: string
  }) {
    return api.post<Report>('/api/reports', data)
  },

  async reviewContent(targetId: string, status: ContentStatus) {
    return api.post(`/api/contents/${targetId}/review`, { status })
  },

  // 消息通知
  async getNotifications() {
    return api.get<Notification[]>('/api/notifications')
  },

  async markNotificationAsRead(notificationId: string) {
    return api.put(`/api/notifications/${notificationId}/read`)
  },

  async markAllNotificationsAsRead() {
    return api.put('/api/notifications/read-all')
  },

  // 获取推荐内容
  async getRecommendedPosts() {
    return api.get<Post[]>('/api/posts/recommended')
  },

  async getRecommendedTopics() {
    return api.get<Topic[]>('/api/topics/recommended')
  },

  async getRecommendedUsers() {
    return api.get<User[]>('/api/users/recommended')
  },
} 
