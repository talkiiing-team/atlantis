import { Bar } from 'react-chartjs-2'
import { useEffect, useId, useMemo, useState } from 'react'
import { Select } from '@chakra-ui/react'
import { Data } from '@/components/types'

export const HeatmapChart = ({ data }: { data?: Data['heatmap'] }) => {
  const [selectedVes, selectVes] = useState<number>()
  const chartId = useId()

  const labels = useMemo(() => {
    return selectedVes && data?.[selectedVes]?.[2]
      ? Object.keys(data[selectedVes][2])
      : []
  }, [selectedVes])
  const series = useMemo(
    // @ts-ignore
    () => (selectedVes ? Object.values(data[selectedVes][2]) : []),
    [selectedVes],
  )

  const anomality: { isAnomal?: boolean; percentage?: number } = useMemo(() => {
    return selectedVes && data?.[selectedVes]
      ? { isAnomal: !!data[selectedVes][0], percentage: data[selectedVes][1] }
      : {}
  }, [selectedVes])

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Аномальность',
        data: series,
        backgroundColor: [
          '#25CCF7',
          '#FD7272',
          '#54a0ff',
          '#00d2d3',
          '#1abc9c',
          '#2ecc71',
          '#3498db',
          '#9b59b6',
          '#34495e',
          '#16a085',
          '#27ae60',
          '#2980b9',
          '#8e44ad',
          '#2c3e50',
          '#f1c40f',
          '#e67e22',
          '#e74c3c',
          '#ecf0f1',
          '#95a5a6',
          '#f39c12',
          '#d35400',
          '#c0392b',
          '#bdc3c7',
          '#7f8c8d',
          '#55efc4',
          '#81ecec',
          '#74b9ff',
          '#a29bfe',
          '#dfe6e9',
          '#00b894',
          '#00cec9',
          '#0984e3',
          '#6c5ce7',
          '#ffeaa7',
          '#fab1a0',
          '#ff7675',
          '#fd79a8',
          '#fdcb6e',
          '#e17055',
          '#d63031',
          '#feca57',
          '#5f27cd',
          '#54a0ff',
          '#01a3a4',
        ],
      },
    ],
    config: {
      id: chartId,
    },
  }

  useEffect(() => {
    console.log(selectedVes)
  }, [selectedVes])

  const options = useMemo(() => {
    return data
      ? Object.keys(data).map(v => {
          return <option value={v}>{v}</option>
        })
      : null
  }, [data])

  return (
    <div className='flex flex-col space-y-6'>
      <Select
        placeholder='Номер судна'
        onChange={e => selectVes(parseInt(e.currentTarget.value))}
      >
        {options}
      </Select>
      <div className='bg-zinc-100 p-2 '>
        {selectedVes ? <Bar id={chartId} data={chartData} /> : 'Выберите судно'}
      </div>
      <div className='flex items-center justify-between space-x-4'>
        <span>Предположительная аномальность, %</span>
        <span>
          {anomality.percentage
            ? Math.round(anomality.percentage * 100) / 100
            : '...'}
          %
        </span>
      </div>
      {anomality.isAnomal !== undefined ? (
        anomality.isAnomal ? (
          <span className='text-xl text-rose-400'>Требует проверки</span>
        ) : (
          <span className='text-xl text-teal-400'>Подтверждено</span>
        )
      ) : null}
    </div>
  )
}
