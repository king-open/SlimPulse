import React from 'react'
import { Tag, Input, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

interface Topic {
  id: string
  name: string
  count: number
}

interface TopicTagsProps {
  topics: Topic[]
  selectedTopics: string[]
  onSelect: (topicId: string) => void
  onDeselect: (topicId: string) => void
  onAdd?: (name: string) => Promise<void>
}

const TopicTags: React.FC<TopicTagsProps> = ({
  topics,
  selectedTopics,
  onSelect,
  onDeselect,
  onAdd,
}) => {
  const [inputVisible, setInputVisible] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const inputRef = React.useRef<Input>(null)

  React.useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus()
    }
  }, [inputVisible])

  const handleAdd = async () => {
    if (!inputValue.trim()) return
    
    try {
      await onAdd?.(inputValue)
      setInputValue('')
      setInputVisible(false)
    } catch (error) {
      console.error('Failed to add topic:', error)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {topics.map(topic => {
        const isSelected = selectedTopics.includes(topic.id)
        return (
          <Tooltip key={topic.id} title={`${topic.count} 个相关帖子`}>
            <Tag
              className="cursor-pointer"
              color={isSelected ? 'primary' : undefined}
              onClick={() => {
                if (isSelected) {
                  onDeselect(topic.id)
                } else {
                  onSelect(topic.id)
                }
              }}
            >
              #{topic.name}
            </Tag>
          </Tooltip>
        )
      })}

      {onAdd && (
        <>
          {inputVisible ? (
            <Input
              ref={inputRef}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onBlur={handleAdd}
              onPressEnter={handleAdd}
            />
          ) : (
            <Tag
              className="cursor-pointer border-dashed"
              onClick={() => setInputVisible(true)}
            >
              <PlusOutlined /> 新话题
            </Tag>
          )}
        </>
      )}
    </div>
  )
}

export default TopicTags 
