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
  useDisclosure,
} from '@chakra-ui/react'
import { GraphChart } from '@/components/GraphChart'

export const DrawerChart = withApp<
  Pick<ReturnType<typeof useDisclosure>, 'isOpen' | 'onOpen' | 'onClose'>
>(({ app, isOpen, onOpen, onClose }) => {
  return (
    <>
      <Drawer isOpen={isOpen} placement='right' onClose={onClose} size='xl'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Данные по ловле</DrawerHeader>

          <DrawerBody>
            <GraphChart id={1} />
          </DrawerBody>

          <DrawerFooter>
            <Button mr={3} colorScheme='blue'>
              Создать отчет...
            </Button>
            <Button variant='outline' onClick={onClose}>
              Понятно
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
})
