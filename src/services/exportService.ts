import { CheckIn } from '../types'
import dayjs from 'dayjs'
import { utils as XLSXUtils, writeFile } from 'xlsx'

export const exportService = {
  // 导出为 Excel
  exportToExcel: (records: CheckIn[]) => {
    const data = records.map(record => ({
      日期: dayjs(record.date).format('YYYY-MM-DD'),
      体重: record.weight || '-',
      体脂率: record.bodyFat ? `${record.bodyFat}%` : '-',
      腰围: record.waistline ? `${record.waistline}cm` : '-',
      卡路里摄入: record.totalCaloriesIn,
      卡路里消耗: record.totalCaloriesOut,
      净消耗: record.totalCaloriesOut - record.totalCaloriesIn,
      运动时长: record.exercises.reduce((total, e) => total + e.duration, 0),
      心情: record.mood,
      备注: record.notes || '-',
    }))

    const ws = XLSXUtils.json_to_sheet(data)
    const wb = XLSXUtils.book_new()
    XLSXUtils.book_append_sheet(wb, ws, '打卡记录')
    writeFile(wb, `fitness-check-${dayjs().format('YYYY-MM-DD')}.xlsx`)
  },

  // 导出为 JSON
  exportToJSON: (records: CheckIn[]) => {
    const dataStr = JSON.stringify(records, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fitness-check-${dayjs().format('YYYY-MM-DD')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },

  // 导出为 CSV
  exportToCSV: (records: CheckIn[]) => {
    const headers = ['日期', '体重', '体脂率', '腰围', '卡路里摄入', '卡路里消耗', '净消耗', '运动时长', '心情', '备注']
    const rows = records.map(record => [
      dayjs(record.date).format('YYYY-MM-DD'),
      record.weight || '',
      record.bodyFat || '',
      record.waistline || '',
      record.totalCaloriesIn,
      record.totalCaloriesOut,
      record.totalCaloriesOut - record.totalCaloriesIn,
      record.exercises.reduce((total, e) => total + e.duration, 0),
      record.mood,
      record.notes || '',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fitness-check-${dayjs().format('YYYY-MM-DD')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
} 
