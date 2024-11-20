import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Post, Comment } from '../../types/community'

interface CommunityState {
  posts: Post[]
  comments: { [postId: string]: Comment[] }
  loading: boolean
  error: string | null
}

const initialState: CommunityState = {
  posts: [],
  comments: {},
  loading: false,
  error: null,
}

// 创建异步 action
export const createPost = createAsyncThunk(
  'community/createPost',
  async (data: { content: string, images?: string[] }) => {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      id: `post_${Date.now()}`,
      userId: 'current_user',
      username: '当前用户',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current_user',
      content: data.content,
      images: data.images,
      likes: 0,
      comments: 0,
      hasLiked: false,
      createdAt: new Date().toISOString(),
      status: 'pending',
      isCollected: false,
      collectedCount: 0,
      shareCount: 0,
      reportCount: 0,
    } as Post
  }
)

export const likePost = createAsyncThunk(
  'community/likePost',
  async (postId: string) => {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    return postId
  }
)

export const addComment = createAsyncThunk(
  'community/addComment',
  async ({ postId, comment }: { postId: string, comment: Comment }) => {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    return { postId, comment }
  }
)

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false
        state.posts.unshift(action.payload)
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '发布失败'
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload)
        if (post) {
          post.hasLiked = !post.hasLiked
          post.likes += post.hasLiked ? 1 : -1
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload
        // 添加评论到评论列表
        if (!state.comments[postId]) {
          state.comments[postId] = []
        }
        state.comments[postId].push(comment)
        
        // 更新帖子的评论数
        const post = state.posts.find(p => p.id === postId)
        if (post) {
          post.comments += 1
        }
      })
  },
})

export default communitySlice.reducer 
