import React from 'react'
import { Skeleton, Card } from 'antd'
import { motion } from 'framer-motion'

export const PostSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="mb-4">
      <Skeleton avatar active paragraph={{ rows: 3 }} />
    </Card>
  </motion.div>
)

export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Card>
      <Skeleton.Avatar size={64} active className="mb-4" />
      <Skeleton active paragraph={{ rows: 2 }} />
    </Card>
    <Card>
      <Skeleton active paragraph={{ rows: 4 }} />
    </Card>
  </div>
)

export const StatisticsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map(i => (
      <Card key={i}>
        <Skeleton.Input active size="small" block className="mb-2" />
        <Skeleton.Input active block />
      </Card>
    ))}
  </div>
) 
