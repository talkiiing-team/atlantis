import { Bar } from 'react-chartjs-2'
import { useEffect, useMemo, useState } from 'react'
import { Select } from '@chakra-ui/react'
import { Data } from '@/components/types'

export const HeatmapChart = ({ data }: { data?: Data['heatmap'] }) => {
  const [selectedVes, selectVes] = useState<number>()

  const labels = useMemo(
    // @ts-ignore
    () => (selectedVes ? Object.keys(data[selectedVes][3]) : []),
    [selectedVes],
  )
  const series = useMemo(
    // @ts-ignore
    () => (selectedVes ? Object.values(data[selectedVes][3]) : []),
    [selectedVes],
  )

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Аномальность',
        data: series,
        borderWidth: 1,
      },
    ],
  }

  useEffect(() => {
    console.log(selectedVes)
  }, [selectedVes])

  return (
    <div className='flex flex-col space-y-6'>
      <Select
        placeholder='Номер судна'
        onChange={e => selectVes(parseInt(e.currentTarget.value))}
      >
        {data
          ? Object.keys(data).map(v => {
              return <option value={v}>{v}</option>
            })
          : null}
      </Select>
      <div>{selectedVes ? <Bar data={chartData} /> : 'Выберите судно'}</div>
      {selectedVes}
    </div>
  )
}
