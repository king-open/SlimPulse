import React from 'react'
import { Card, Form, DatePicker, Select, Button, Space } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

interface FilterValues {
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs]
  type?: string[]
  sortBy?: string
}

interface DataFilterProps {
  onFilter: (values: FilterValues) => void
  onReset: () => void
}

const DataFilter: React.FC<DataFilterProps> = ({ onFilter, onReset }) => {
  const [form] = Form.useForm()

  const handleFilter = (values: FilterValues) => {
    onFilter(values)
  }

  const handleReset = () => {
    form.resetFields()
    onReset()
  }

  return (
    <Card className="mb-4">
      <Form
        form={form}
        layout="inline"
        onFinish={handleFilter}
      >
        <Form.Item name="dateRange" label="日期范围">
          <RangePicker />
        </Form.Item>
        <Form.Item name="type" label="数据类型">
          <Select
            mode="multiple"
            placeholder="选择数据类型"
            style={{ width: 200 }}
            options={[
              { label: '体重', value: 'weight' },
              { label: '体脂率', value: 'bodyFat' },
              { label: '卡路里', value: 'calories' },
              { label: '运动', value: 'exercise' },
            ]}
          />
        </Form.Item>
        <Form.Item name="sortBy" label="排序">
          <Select
            placeholder="选择排序方式"
            style={{ width: 120 }}
            options={[
              { label: '日期升序', value: 'dateAsc' },
              { label: '日期降序', value: 'dateDesc' },
              { label: '体重升序', value: 'weightAsc' },
              { label: '体重降序', value: 'weightDesc' },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              筛选
            </Button>
            <Button onClick={handleReset} icon={<ReloadOutlined />}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default DataFilter 
