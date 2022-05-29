import { withApp } from '@/hoc/withApp'
import { FC, useMemo } from 'react'

export const Block = () => {
  return <div className='h-40 w-60 rounded-xl border'></div>
}

export const Row: FC<{ children: JSX.Element[] | JSX.Element }> = ({
  children,
}) => {
  return (
    <div className='flex w-full items-center justify-center space-x-4'>
      {children}
    </div>
  )
}

const graph = [[1], [1, 1], [1, 1], [1, 1, 1], [1, 1], [1]]

export const GraphChart = withApp<{ id: string }>(({ app, id }) => {
  const visualizedGraph = useMemo(() => {
    return graph.map(row => (
      <Row>
        {row.map(block => (
          <Block />
        ))}
      </Row>
    ))
  }, [graph])

  return (
    <div className='flex h-full w-full flex-col items-center space-y-8'>
      {visualizedGraph}
    </div>
  )
})
