export interface Post {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  images?: string[]
  likes: number
  comments: number
  hasLiked: boolean
  createdAt: string
  checkInData?: {
    weight?: number
    exercises?: {
      type: string
      duration: number
      calories: number
    }[]
    totalCaloriesOut?: number
  }
  topics?: string[]
  status: ContentStatus
  isCollected: boolean
  collectedCount: number
  shareCount: number
  reportCount: number
}

export interface Comment {
  id: string
  postId: string
  userId: string
  username: string
  avatar: string
  content: string
  createdAt: string
  likes: number
  hasLiked: boolean
}

export interface Topic {
  id: string
  name: string
  description: string
  icon?: string
  postCount: number
  followerCount: number
  isFollowing: boolean
  createdAt: string
}

export interface UserRelation {
  id: string
  followerId: string
  followingId: string
  createdAt: string
}

export type ContentStatus = 'pending' | 'approved' | 'rejected'

export interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system'
  from: {
    id: string
    username: string
    avatar: string
  }
  to: {
    id: string
    username: string
  }
  content: string
  relatedPostId?: string
  relatedCommentId?: string
  isRead: boolean
  createdAt: string
}

export interface Report {
  id: string
  userId: string
  targetType: 'post' | 'comment'
  targetId: string
  reason: string
  description?: string
  status: 'pending' | 'resolved' | 'rejected'
  createdAt: string
} 
