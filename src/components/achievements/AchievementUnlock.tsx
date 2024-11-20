import React from 'react'
import { Modal, Typography, Button } from 'antd'
import { TrophyOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import type { CreateTypes } from 'canvas-confetti'
import confetti from 'canvas-confetti'
import { Achievement } from '../../types/achievement'

const { Title, Text } = Typography

interface AchievementUnlockProps {
  achievement: Achievement
  visible: boolean
  onClose: () => void
}

const AchievementUnlock: React.FC<AchievementUnlockProps> = ({
  achievement,
  visible,
  onClose,
}) => {
  React.useEffect(() => {
    if (visible) {
      // 播放成就解锁动画
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#52c41a'],
      })
    }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <Modal
          open={visible}
          footer={null}
          onCancel={onClose}
          width={400}
          centered
          closable={false}
          maskStyle={{ backdropFilter: 'blur(4px)' }}
          className="achievement-unlock-modal"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1 }}
              className="inline-block mb-4"
            >
              <TrophyOutlined className="text-6xl text-yellow-500" />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Title level={3} className="mb-2">
                成就解锁！
              </Title>
              <Title level={4} className="text-primary mb-4">
                {achievement.title}
              </Title>
              <Text className="block text-gray-500 mb-6">
                {achievement.description}
              </Text>

              {achievement.reward && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="mb-6"
                >
                  <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                    <Text className="text-yellow-600">
                      获得奖励：{achievement.reward.value} 积分
                    </Text>
                  </div>
                </motion.div>
              )}

              <Button type="primary" size="large" onClick={onClose}>
                太棒了！
              </Button>
            </motion.div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  )
}

export default AchievementUnlock 
