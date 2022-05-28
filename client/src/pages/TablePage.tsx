import { withApp } from '@/hoc/withApp'
import {
  Heading,
  IconButton,
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

export const TablePage = () => {
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
        Живая таблица
      </Heading>
      <div className=' w-full max-w-4xl grow rounded-xl border'>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>ID собственника</Th>
              <Th>Дата ловли</Th>
              <Th isNumeric>Отклонение</Th>
              <Th>Статус</Th>
              <Th>
                <EyeIcon className='h-5 w-5' />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>982368</Td>
              <Td>25.06.2021</Td>
              <Td isNumeric>12.4%</Td>
              <Td className='text-rose-400'>Требует проверки</Td>
              <Td>
                <IconButton
                  size='sm'
                  fontSize='lg'
                  aria-label={`Open Data`}
                  variant='ghost'
                  color='current'
                  onClick={openChart(735275)}
                  icon={<ChevronRightIcon className='h-5 w-5' />}
                />
              </Td>
            </Tr>
            <Tr>
              <Td>483724</Td>
              <Td>24.06.2021</Td>
              <Td isNumeric>16.0%</Td>
              <Td className='text-rose-400'>Требует проверки</Td>
              <Td>
                <IconButton
                  size='sm'
                  fontSize='lg'
                  aria-label={`Open Data`}
                  variant='ghost'
                  color='current'
                  onClick={openChart(735275)}
                  icon={<ChevronRightIcon className='h-5 w-5' />}
                />
              </Td>
            </Tr>
            <Tr>
              <Td>162627</Td>
              <Td>23.06.2021</Td>
              <Td isNumeric>2.1%</Td>
              <Td className='text-teal-400'>Подтверждено</Td>
              <Td>
                <IconButton
                  size='sm'
                  fontSize='lg'
                  aria-label={`Open Data`}
                  variant='ghost'
                  color='current'
                  onClick={openChart(735275)}
                  icon={<ChevronRightIcon className='h-5 w-5' />}
                />
              </Td>
            </Tr>
            <Tr>
              <Td>27587</Td>
              <Td>21.06.2021</Td>
              <Td isNumeric>4.9%</Td>
              <Td className='text-teal-400'>Подтверждено</Td>
              <Td>
                <IconButton
                  size='sm'
                  fontSize='lg'
                  aria-label={`Open Data`}
                  variant='ghost'
                  color='current'
                  onClick={openChart(735275)}
                  icon={<ChevronRightIcon className='h-5 w-5' />}
                />
              </Td>
            </Tr>
            <Tr>
              <Td>273847</Td>
              <Td>20.06.2021</Td>
              <Td isNumeric>6.8%</Td>
              <Td className='text-teal-400'>Подтверждено</Td>
              <Td>
                <IconButton
                  size='sm'
                  fontSize='lg'
                  aria-label={`Open Data`}
                  variant='ghost'
                  color='current'
                  onClick={openChart(735275)}
                  icon={<ChevronRightIcon className='h-5 w-5' />}
                />
              </Td>
            </Tr>
            <Tr>
              <Td>735275</Td>
              <Td>18.06.2021</Td>
              <Td isNumeric>3.8%</Td>
              <Td className='text-teal-400'>Подтверждено</Td>
              <Td>
                <IconButton
                  size='sm'
                  fontSize='lg'
                  aria-label={`Open Data`}
                  variant='ghost'
                  color='current'
                  onClick={openChart(735275)}
                  icon={<ChevronRightIcon className='h-5 w-5' />}
                />
              </Td>
            </Tr>
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>ID собственника</Th>
              <Th>Дата ловли</Th>
              <Th isNumeric>Отклонение</Th>
              <Th>Статус</Th>
              <Th>
                <EyeIcon className='h-5 w-5' />
              </Th>
            </Tr>
          </Tfoot>
        </Table>
      </div>
      <DrawerChart isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </div>
  )
}