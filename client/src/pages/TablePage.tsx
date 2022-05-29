import { withApp } from '@/hoc/withApp'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Heading,
  IconButton,
  Spinner,
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
import {
  ChevronRightIcon,
  EyeIcon,
  RefreshIcon,
} from '@heroicons/react/outline'
import {
  FormEvent,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { DrawerChart } from '@/components/DrawerChart'
import { DateTime } from 'luxon'
import { ax } from '@/services/pokeCore'
import { useRecoilState } from 'recoil'
import { currentRecordsStore } from '@/store/currentRecordsStore'

type Request = {
  createdAt: string
  _id: string
  resolved: string[]
  errorCount?: number
}

export const TablePage = withApp(({ app }) => {
  const [currentRecord, setCurrentRecord] = useRecoilState(currentRecordsStore)
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose() {
      setCurrentRecord('')
    },
  })

  const openChart = useCallback(
    (id: string) => () => {
      setCurrentRecord(id)
      onOpen()
    },
    [],
  )

  const [data, setData] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  const resfreshTable = useCallback(() => {
    setLoading(true)
    app
      .service('requests')('')
      .then((r: any) => {
        console.log(r)
        setData(
          (r.data.data as Request[]).sort(
            (a, b) =>
              DateTime.fromISO(b.createdAt).toSeconds() -
              DateTime.fromISO(a.createdAt).toSeconds(),
          ),
        )
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    resfreshTable()
  }, [])

  const formSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    ax.post('upload', formData)
      .then(res => {
        console.log(`Success` + res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <div className='flex h-full w-full flex-col items-center space-y-8'>
      <div className='mt-28 flex items-center space-x-8'>
        <Heading as='h1' size='xl' noOfLines={1}>
          Наборы данных
        </Heading>
        <RefreshIcon
          className={`h-8 w-8 p-1 text-slate-300 ${
            loading ? 'animate-spin' : ''
          }`}
          onClick={resfreshTable}
        />
      </div>
      <Accordion allowToggle className='w-full max-w-3xl'>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                Загрузить данные
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <form
              onSubmit={formSubmit}
              className='mt-4 flex w-full flex-col items-center space-y-6'
            >
              <div className='flex w-full items-center justify-between space-x-4'>
                <span className='text-slate-300'>Catch</span>
                <input accept='text/csv' name='catch.csv' type='file' />
              </div>
              <div className='flex w-full items-center justify-between space-x-4'>
                <span className='text-slate-300'>Product</span>
                <input accept='text/csv' name='product.csv' type='file' />
              </div>
              <div className='flex w-full items-center justify-between space-x-4'>
                <span className='text-slate-300'>External 1</span>
                <input accept='text/csv' name='ext1.csv' type='file' />
              </div>
              <div className='flex w-full items-center justify-between space-x-4'>
                <span className='text-slate-300'>External 2</span>
                <input accept='text/csv' name='ext2.csv' type='file' />
              </div>
              <Button type='submit'>Загрузить</Button>
            </form>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <div className=' flex w-full max-w-4xl grow flex-col items-center rounded-xl border'>
        {loading ? (
          <div className=' my-20 flex items-center space-x-4'>
            <Spinner />
            <span className='animate-pulse'>Загрузка таблицы</span>
          </div>
        ) : (
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Дата анализа</Th>
                <Th>Статус</Th>
                <Th>Выявлено аномалий</Th>
                <Th>
                  <EyeIcon className='h-5 w-5' />
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map(el => {
                console.log(DateTime.fromISO(el.createdAt))
                return (
                  <Tr>
                    <Td>
                      {DateTime.fromISO(el.createdAt).toFormat(
                        'dd.MM.yyyy HH:mm:ss',
                      )}
                    </Td>
                    {el.resolved.length ? (
                      el.errorCount ? (
                        <Td className='text-rose-400'>Требует проверки</Td>
                      ) : (
                        <Td className='text-teal-400'>Подтверждено</Td>
                      )
                    ) : (
                      <Td className='text-zinc-300'>Ожидаем...</Td>
                    )}
                    <Td>
                      {el.errorCount !== undefined ? el.errorCount : '...'}
                    </Td>
                    <Td>
                      <IconButton
                        size='sm'
                        fontSize='lg'
                        aria-label={`Open Data`}
                        variant='ghost'
                        color='current'
                        onClick={openChart(el._id)}
                        icon={<ChevronRightIcon className='h-5 w-5' />}
                      />
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Дата анализа</Th>
                <Th>Статус</Th>
                <Th>Выявлено аномалий</Th>
                <Th>
                  <EyeIcon className='h-5 w-5' />
                </Th>
              </Tr>
            </Tfoot>
          </Table>
        )}
      </div>
      <DrawerChart isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </div>
  )
})
