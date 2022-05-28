import { withApp } from '@/hoc/withApp'
import {
  Heading,
  IconButton,
  Input,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { ChevronRightIcon, EyeIcon } from '@heroicons/react/outline'
import { useCallback } from 'react'
import { DrawerChart } from '@/components/DrawerChart'

export const SearchPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const openChart = useCallback(
    (id: string | number) => () => {
      onOpen()
    },
    [],
  )

  return (
    <div className='flex h-full w-full flex-col items-center space-y-8'>
      <Heading as='h1' size='xl' className='mt-28' noOfLines={1}>
        Поиск по владельцу
      </Heading>

      <div className=' w-full max-w-4xl grow rounded-xl border p-2'>
        <Input placeholder='Идентификатор владельца' />
      </div>
      <DrawerChart isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </div>
  )
}
