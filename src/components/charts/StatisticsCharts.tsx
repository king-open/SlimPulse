import React, { useEffect, useRef } from 'react'
import { Card, Tabs } from 'antd'
import * as echarts from 'echarts'
import { useAppSelector } from '../../store'

const StatisticsCharts: React.FC = () => {
  const weightChartRef = useRef<HTMLDivElement>(null)
  const caloriesChartRef = useRef<HTMLDivElement>(null)
  const { stats } = useAppSelector(state => state.checkIn)

  useEffect(() => {
    if (weightChartRef.current && stats.weightTrend.length > 0) {
      const chart = echarts.init(weightChartRef.current)
      
      const option = {
        title: {
          text: '体重变化趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c}kg'
        },
        xAxis: {
          type: 'category',
          data: stats.weightTrend.map(item => item.date),
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: '体重(kg)',
          min: (value: { min: number }) => Math.floor(value.min - 1),
          max: (value: { max: number }) => Math.ceil(value.max + 1),
        },
        series: [
          {
            data: stats.weightTrend.map(item => item.value),
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#1890ff'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(24,144,255,0.3)' },
                { offset: 1, color: 'rgba(24,144,255,0.1)' }
              ])
            }
          }
        ],
        grid: {
          bottom: 60
        }
      }

      chart.setOption(option)
      return () => chart.dispose()
    }
  }, [stats.weightTrend])

  useEffect(() => {
    if (caloriesChartRef.current && stats.caloriesTrend.length > 0) {
      const chart = echarts.init(caloriesChartRef.current)
      
      const option = {
        title: {
          text: '卡路里摄入/消耗趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['摄入', '消耗'],
          top: 30
        },
        xAxis: {
          type: 'category',
          data: stats.caloriesTrend.map(item => item.date),
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: '卡路里(kcal)'
        },
        series: [
          {
            name: '摄入',
            type: 'bar',
            stack: 'total',
            data: stats.caloriesTrend.map(item => item.in),
            itemStyle: {
              color: '#ff4d4f'
            }
          },
          {
            name: '消耗',
            type: 'bar',
            stack: 'total',
            data: stats.caloriesTrend.map(item => item.out),
            itemStyle: {
              color: '#52c41a'
            }
          }
        ],
        grid: {
          bottom: 60,
          top: 80
        }
      }

      chart.setOption(option)
      return () => chart.dispose()
    }
  }, [stats.caloriesTrend])

  const items = [
    {
      key: 'weight',
      label: '体重趋势',
      children: <div ref={weightChartRef} style={{ height: '400px' }} />,
    },
    {
      key: 'calories',
      label: '卡路里趋势',
      children: <div ref={caloriesChartRef} style={{ height: '400px' }} />,
    },
  ]

  return (
    <Card>
      <Tabs items={items} />
    </Card>
  )
}

export default StatisticsCharts 
