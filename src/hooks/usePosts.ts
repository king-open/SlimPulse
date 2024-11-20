import { useState, useCallback } from 'react'
import { Post, Comment } from '../types/community'
import { notificationService } from '../services/notification'
import { useAppDispatch } from '../store'
import { 
  createPost as createPostAction, 
  likePost as likePostAction,
  addComment as addCommentAction,
} from '../store/slices/communitySlice'

// 模拟初始数据
const mockPosts: Post[] = [
  {
    id: 'post_1',
    userId: 'user_1',
    username: '健身达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user_1',
    content: '今天完成了5公里跑步，感觉状态越来越好了！💪',
    images: [
      'https://picsum.photos/400/300?random=1',
    ],
    likes: 12,
    comments: 3,
    hasLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    checkInData: {
      exercises: [
        {
          type: '跑步',
          duration: 30,
          calories: 300,
        }
      ],
      totalCaloriesOut: 300,
    },
    status: 'approved',
    isCollected: false,
    collectedCount: 5,
    shareCount: 2,
    reportCount: 0,
  },
  {
    id: 'post_2',
    userId: 'user_2',
    username: '营养师小王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user_2',
    content: '分享一个健康早餐搭配：全麦面包🍞 + 牛油果🥑 + 煎蛋🍳，营养美味又饱腹！',
    images: [
      'https://picsum.photos/400/300?random=2',
      'https://picsum.photos/400/300?random=3',
    ],
    likes: 45,
    comments: 8,
    hasLiked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    topics: ['健康饮食', '营养搭配'],
    status: 'approved',
    isCollected: true,
    collectedCount: 20,
    shareCount: 15,
    reportCount: 0,
  },
  {
    id: 'post_3',
    userId: 'user_3',
    username: '减肥小达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user_3',
    content: '坚持打卡第30天，终于突破了70kg！感谢大家的鼓励和支持❤️',
    likes: 88,
    comments: 15,
    hasLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    checkInData: {
      weight: 69.8,
    },
    status: 'approved',
    isCollected: false,
    collectedCount: 10,
    shareCount: 5,
    reportCount: 0,
  },
]

// 模拟评论数据
const mockComments: { [postId: string]: Comment[] } = {
  'post_1': [
    {
      id: 'comment_1',
      postId: 'post_1',
      userId: 'user_2',
      username: '健身达人',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user_2',
      content: '加油，继续保持！💪',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      likes: 5,
      hasLiked: false,
    },
    {
      id: 'comment_2',
      postId: 'post_1',
      userId: 'user_3',
      username: '营养师小王',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user_3',
      content: '运动后记得补充蛋白质哦！',
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      likes: 3,
      hasLiked: true,
    },
  ],
  'post_2': [
    {
      id: 'comment_3',
      postId: 'post_2',
      userId: 'user_4',
      username: '美食家',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user_4',
      content: '看起来好美味，分享一下食谱吧！',
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      likes: 8,
      hasLiked: false,
    },
  ],
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const dispatch = useAppDispatch()

  const createPost = useCallback(async ({ content, images }: { content: string, images?: string[] }) => {
    try {
      setLoading(true)
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
        status: 'pending',
        isCollected: false,
        collectedCount: 0,
        shareCount: 0,
        reportCount: 0,
      }
      await dispatch(createPostAction(newPost)).unwrap()
      setPosts(prev => [newPost, ...prev])
      notificationService.success('发布成功', '你的动态已发布')
      return newPost
    } catch (err) {
      const message = err instanceof Error ? err.message : '发布失败'
      setError(message)
      notificationService.error('发布失败', '请稍后重试')
      throw err
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  const likePost = useCallback(async (postId: string) => {
    try {
      await dispatch(likePostAction(postId)).unwrap()
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
  }, [dispatch])

  const collectPost = useCallback(async (postId: string) => {
    try {
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isCollected: !post.isCollected,
            collectedCount: post.isCollected ? post.collectedCount - 1 : post.collectedCount + 1,
          }
        }
        return post
      }))
      notificationService.success(
        posts.find(p => p.id === postId)?.isCollected ? '取消收藏' : '收藏成功'
      )
    } catch (err) {
      notificationService.error('操作失败', '请稍后重试')
    }
  }, [posts])

  const sharePost = useCallback(async (postId: string) => {
    try {
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            shareCount: post.shareCount + 1,
          }
        }
        return post
      }))
      notificationService.success('分享成功')
    } catch (err) {
      notificationService.error('分享失败', '请稍后重试')
    }
  }, [])

  const reportPost = useCallback(async (postId: string, reason: string) => {
    try {
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            reportCount: post.reportCount + 1,
          }
        }
        return post
      }))
      notificationService.success('举报已提交', '我们会尽快处理')
    } catch (err) {
      notificationService.error('举报失败', '请稍后重试')
    }
  }, [])

  const addComment = useCallback(async (postId: string, content: string) => {
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

      await dispatch(addCommentAction({ postId, comment: newComment })).unwrap()

      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }))

      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments + 1,
          }
        }
        return post
      }))

      notificationService.success('评论成功')
      return newComment
    } catch (err) {
      const message = err instanceof Error ? err.message : '评论失败'
      setError(message)
      notificationService.error('评论失败', '请稍后重试')
      throw err
    }
  }, [dispatch])

  const likeComment = useCallback(async (commentId: string) => {
    try {
      setComments(prev => {
        const newComments = { ...prev }
        Object.keys(newComments).forEach(postId => {
          newComments[postId] = newComments[postId].map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes: comment.hasLiked ? comment.likes - 1 : comment.likes + 1,
                hasLiked: !comment.hasLiked,
              }
            }
            return comment
          })
        })
        return newComments
      })
      notificationService.success(
        '操作成功',
        '你可以在个人中心查看获赞评论'
      )
    } catch (err) {
      notificationService.error('操作失败', '请稍后重试')
    }
  }, [])

  const getComments = useCallback(async (postId: string) => {
    try {
      setLoading(true)
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 500))
      // 使用模拟数据
      setComments(prev => ({
        ...prev,
        [postId]: mockComments[postId] || [],
      }))
      return mockComments[postId] || []
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取评论失败'
      setError(message)
      notificationService.error('获取评论失败', '请稍后重试')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    posts,
    comments,
    loading,
    error,
    createPost,
    likePost,
    collectPost,
    sharePost,
    reportPost,
    addComment,
    likeComment,
    getComments,
  }
} 
