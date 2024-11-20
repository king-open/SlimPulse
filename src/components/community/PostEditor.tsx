import React, { useState } from 'react'
import { Form, Input, Button, Upload, Space, Switch } from 'antd'
import { PictureOutlined, ShareAltOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import { useCheckIn } from '../../hooks/useCheckIn'

const { TextArea } = Input

interface PostEditorProps {
  onSubmit: (content: string, images?: string[]) => Promise<void>
}

const PostEditor: React.FC<PostEditorProps> = ({ onSubmit }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [shareCheckIn, setShareCheckIn] = useState(false)
  const { records } = useCheckIn()

  const handleSubmit = async (values: { content: string }) => {
    try {
      setLoading(true)
      const images = fileList.map(file => file.url || file.thumbUrl || '')
      await onSubmit(values.content, images)
      form.resetFields()
      setFileList([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name="content"
        rules={[{ required: true, message: '请输入内容' }]}
      >
        <TextArea
          placeholder="分享你的健康生活..."
          autoSize={{ minRows: 3, maxRows: 6 }}
          maxLength={500}
          showCount
        />
      </Form.Item>

      <div className="flex items-center justify-between">
        <Space>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            maxCount={9}
          >
            <div>
              <PictureOutlined />
              <div className="mt-2">上传图片</div>
            </div>
          </Upload>

          <Space align="center">
            <ShareAltOutlined />
            <span>分享打卡</span>
            <Switch
              checked={shareCheckIn}
              onChange={setShareCheckIn}
              disabled={!records.length}
            />
          </Space>
        </Space>

        <Button 
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          发布
        </Button>
      </div>
    </Form>
  )
}

export default PostEditor 
