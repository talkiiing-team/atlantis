import { withApp } from '@/hoc/withApp'
import graphs from '@/assets/graphmap.json'
import { Button } from '@chakra-ui/react'

export const Graphs = withApp<{}>(({ app }) => {
  return (
    <div className='flex h-full w-full flex-col space-y-4'>
      {graphs.map(eat => (
        <Button as='a' href={`/${eat.path}`} target='_blank'>
          {eat.name}
        </Button>
      ))}
    </div>
  )
})
