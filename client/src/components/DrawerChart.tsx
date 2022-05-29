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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react'
import { GraphChart } from '@/components/GraphChart'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentRecordsStore } from '@/store/currentRecordsStore'
import { ax } from '@/services/pokeCore'

export const DrawerChart = withApp<
  Pick<ReturnType<typeof useDisclosure>, 'isOpen' | 'onOpen' | 'onClose'>
>(({ app, isOpen, onOpen, onClose }) => {
  const [data, setData] = useState()

  const [currentRecord, setCurrentRecord] = useRecoilState(currentRecordsStore)

  useEffect(() => {
    if (currentRecord.length)
      ax.get(`requests/${currentRecord}`).then(r => {
        console.log(r)
      })
  }, [currentRecord])

  return (
    <>
      <Drawer isOpen={isOpen} placement='right' onClose={onClose} size='xl'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Данные по ловле</DrawerHeader>

          <DrawerBody>
            <Tabs>
              <TabList>
                <Tab>One</Tab>
                <Tab>Two</Tab>
                <Tab>Three</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <p>one!</p>
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
                <TabPanel>
                  <p>three!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
            <GraphChart id={1} />
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
