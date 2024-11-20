import React from 'react'
import { Form, Input, Typography } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'

const { Text } = Typography

interface ValidatedInputProps {
  name: string
  label: string
  rules: any[]
  validateStatus?: '' | 'success' | 'warning' | 'error' | 'validating' | undefined
  hasFeedback?: boolean
  [key: string]: any
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  name,
  label,
  rules,
  validateStatus,
  hasFeedback = true,
  ...props
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      validateStatus={validateStatus}
      hasFeedback={hasFeedback}
      help={
        <AnimatePresence mode="wait">
          {validateStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Text type="danger">
                {props['data-error-message'] || '请检查输入是否正确'}
              </Text>
            </motion.div>
          )}
        </AnimatePresence>
      }
    >
      <Input {...props} />
    </Form.Item>
  )
} 
