import React from 'react'
import { Tour, Button } from 'antd'
import type { TourProps } from 'antd'
import { storageService } from '../../services/storage'

const tourSteps: TourProps['steps'] = [
  {
    title: '欢迎使用',
    description: '让我们快速了解一下主要功能',
    target: () => document.querySelector('.ant-layout-sider'),
  },
  {
    title: '打卡按钮',
    description: '点击这里开始你的每日健康打卡',
    target: () => document.querySelector('.checkin-button'),
  },
  {
    title: '数据统计',
    description: '在这里查看你的健康数据统计和趋势',
    target: () => document.querySelector('.statistics-section'),
  },
  {
    title: '社区功能',
    description: '与其他用户分享你的健康生活',
    target: () => document.querySelector('.community-section'),
  },
]

const TourGuide: React.FC = () => {
  const [open, setOpen] = React.useState(!storageService.get('tourCompleted'))

  const onClose = () => {
    setOpen(false)
    storageService.set('tourCompleted', true)
  }

  return (
    <Tour
      open={open}
      onClose={onClose}
      steps={tourSteps}
      indicatorsRender={(current, total) => (
        <span className="text-gray-500">
          {current + 1} / {total}
        </span>
      )}
    />
  )
}

export default TourGuide 
