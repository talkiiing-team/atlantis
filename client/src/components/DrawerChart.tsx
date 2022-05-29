import { withApp } from '@/hoc/withApp'
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react'
import { GraphChart } from '@/components/GraphChart'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentRecordsStore } from '@/store/currentRecordsStore'
import { ax } from '@/services/pokeCore'
import { HeatmapChart } from '@/components/HeatmapChart'
import { Data } from '@/components/types'
import { LinesChart } from '@/components/LinesChart'
import { Graphs } from '@/components/Graphs'

export const DrawerChart = withApp<
  Pick<ReturnType<typeof useDisclosure>, 'isOpen' | 'onOpen' | 'onClose'>
>(({ app, isOpen, onOpen, onClose }) => {
  const [data, setData] = useState<Data>()
  const [loading, setLoading] = useState<boolean>(false)

  const [currentRecord, setCurrentRecord] = useRecoilState(currentRecordsStore)

  useEffect(() => {
    setLoading(true)
    if (currentRecord.length)
      ax.get(`requests/${currentRecord}`).then(r => {
        console.log(r)
        setData(r.data.data)
        setLoading(false)
      })
  }, [currentRecord])

  const tabNames = useMemo(() => {
    return data ? data.resolved.map(key => key) : []
  }, [data])

  return (
    <>
      <Drawer isOpen={isOpen} placement='right' onClose={onClose} size='xl'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Данные по ловле</DrawerHeader>

          <DrawerBody>
            {loading ? (
              <Spinner />
            ) : (
              <Tabs>
                <TabList>
                  <Tab disabled={!tabNames.includes('heatmap')}>Heatmap</Tab>
                  <Tab disabled={!tabNames.includes('graph')}>Graph</Tab>
                  <Tab disabled={!tabNames.includes('chart')}>Chart</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <HeatmapChart data={data?.heatmap} />
                  </TabPanel>
                  <TabPanel>
                    <Graphs />
                  </TabPanel>
                  <TabPanel>
                    <LinesChart data={data?.plots} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button mr={3} colorScheme='blue'>
              Создать отчет...
            </Button>
            <Button variant='outline' onClick={onClose}>
              Закрыть
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
})
