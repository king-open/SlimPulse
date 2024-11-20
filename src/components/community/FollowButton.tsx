import React from 'react'
import { Button } from 'antd'
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons'

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
  onFollow: (userId: string) => Promise<void>
  onUnfollow: (userId: string) => Promise<void>
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  isFollowing,
  onFollow,
  onUnfollow,
}) => {
  const [loading, setLoading] = React.useState(false)

  const handleClick = async () => {
    try {
      setLoading(true)
      if (isFollowing) {
        await onUnfollow(userId)
      } else {
        await onFollow(userId)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type={isFollowing ? 'default' : 'primary'}
      icon={isFollowing ? <UserDeleteOutlined /> : <UserAddOutlined />}
      onClick={handleClick}
      loading={loading}
    >
      {isFollowing ? '取消关注' : '关注'}
    </Button>
  )
}

export default FollowButton 
