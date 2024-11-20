import { useState, useCallback } from 'react'
import { Post, Comment } from '../types/community'
import { notificationService } from '../services/notification'

export const useCommunity = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [following, setFollowing] = useState<Set<string>>(new Set())

  // 创建帖子
  const createPost = useCallback(async ({ content, images }: { content: string, images?: string[] }) => {
    try {
      setLoading(true)
      // 模拟API调用
      const newPost: Post = {
        id: `post_${Date.now()}`,
        userId: 'current_user',
        username: '当前用户',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current_user',
        content,
        images,
        likes: 0,
        comments: 0,
        hasLiked: false,
        createdAt: new Date().toISOString(),
      }
      setPosts(prev => [newPost, ...prev])
      notificationService.success('发布成功')
      return newPost
    } catch (err) {
      const message = err instanceof Error ? err.message : '发布失败'
      setError(message)
      notificationService.error('发布失败', '请稍后重试')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // 点赞帖子
  const likePost = useCallback(async (postId: string) => {
    try {
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
            hasLiked: !post.hasLiked,
          }
        }
        return post
      }))
    } catch (err) {
      const message = err instanceof Error ? err.message : '操作失败'
      setError(message)
      notificationService.error('操作失败', '请稍后重试')
      throw err
    }
  }, [])

  // 评论帖子
  const commentPost = useCallback(async (postId: string, content: string) => {
    try {
      const newComment: Comment = {
        id: `comment_${Date.now()}`,
        postId,
        userId: 'current_user',
        username: '当前用户',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current_user',
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
        hasLiked: false,
      }
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments + 1,
          }
        }
        return post
      }))
      return newComment
    } catch (err) {
      const message = err instanceof Error ? err.message : '评论失败'
      setError(message)
      notificationService.error('评论失败', '请稍后重试')
      throw err
    }
  }, [])

  // 关注用户
  const followUser = useCallback(async (userId: string) => {
    try {
      setFollowing(prev => {
        const next = new Set(prev)
        next.add(userId)
        return next
      })
      notificationService.success('关注成功')
    } catch (err) {
      const message = err instanceof Error ? err.message : '关注失败'
      setError(message)
      notificationService.error('关注失败', '请稍后重试')
      throw err
    }
  }, [])

  // 取消关注
  const unfollowUser = useCallback(async (userId: string) => {
    try {
      setFollowing(prev => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
      notificationService.success('已取消关注')
    } catch (err) {
      const message = err instanceof Error ? err.message : '操作失败'
      setError(message)
      notificationService.error('操作失败', '请稍后重试')
      throw err
    }
  }, [])

  // 检查是否关注
  const isFollowing = useCallback((userId: string) => {
    return following.has(userId)
  }, [following])

  return {
    posts,
    loading,
    error,
    createPost,
    likePost,
    commentPost,
    followUser,
    unfollowUser,
    isFollowing,
  }
} 
