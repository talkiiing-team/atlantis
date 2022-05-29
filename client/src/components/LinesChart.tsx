import { Line } from 'react-chartjs-2'
import { useEffect, useId, useMemo, useState } from 'react'
import { Select } from '@chakra-ui/react'
import { Data } from '@/components/types'

export const LinesChart = ({ data }: { data?: Data['plots'] }) => {
  const [selectedVes, selectVes] = useState<number>()
  const chartId = useId()

  const series = useMemo(
    () =>
      selectedVes && data?.[selectedVes]
        ? [
            data[selectedVes][1].map((y: number, i: number) => ({
              x: data[selectedVes][0][i],
              y,
            })),
            data[selectedVes][2].map((y: number, i: number) => ({
              x: data[selectedVes][0][i],
              y,
            })),
          ]
        : [],
    [selectedVes],
  )

  const chartData = useMemo(
    () => ({
      datasets: series
        ? [
            {
              label: 'Вылов',
              data: series[0],
              borderColor: '#2563eb',
            },
            {
              label: 'Продажа',
              data: series[1],
              borderColor: '#f43f5e',
            },
          ]
        : [],
      config: {
        id: chartId,
      },
      options: {
        scales: {
          x: {
            type: 'time',
          },
        },
      },
    }),
    [chartId, series],
  )

  useEffect(() => {
    console.log(selectedVes)
  }, [selectedVes])

  useEffect(() => {
    console.log(chartData)
  }, [chartData])

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

      <div className='bg-zinc-100 p-2 text-black'>
        {selectedVes ? (
          data?.[selectedVes]?.[0]?.length ? (
            <Line id={chartId} data={chartData} />
          ) : (
            'Данных нет'
          )
        ) : (
          'Выберите судно'
        )}
      </div>
    </div>
  )
}
