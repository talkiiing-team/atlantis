import {
  Box,
  BoxProps,
  Button,
  chakra,
  Flex,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useUpdateEffect,
} from '@chakra-ui/react'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useViewportScroll } from 'framer-motion'
import {
  MoonIcon,
  SearchIcon,
  SunIcon,
  ViewGridIcon,
} from '@heroicons/react/outline'
import { ReactComponent as Logo } from '@/assets/logo.svg'
import { ReactComponent as Name } from '@/assets/name.svg'
import { useNavigate } from 'react-router-dom'

const HeaderContent = () => {
  const navigate = useNavigate()

  const { toggleColorMode: toggleMode } = useColorMode()
  const text = useColorModeValue('dark', 'light')
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon)

  return (
    <>
      <Flex w='full' h='full' px='6' align='center' justify='space-between'>
        <div
          className='flex cursor-pointer items-center space-x-4'
          onClick={() => navigate('/')}
        >
          <Logo className='h-12 w-12 -translate-y-1' />
          <Name className='h-8' />
        </div>

        <Flex
          justify='flex-end'
          w='full'
          maxW='824px'
          align='center'
          color='gray.400'
        >
          <HStack display='flex'>
            <Button
              size='sm'
              fontSize='md'
              aria-label='Open Table'
              variant='ghost'
              color='current'
              textColor='blue.400'
              leftIcon={<ViewGridIcon className='h-5 w-5 text-current' />}
              onClick={() => navigate('/')}
            >
              Наборы данных
            </Button>
            <IconButton
              size='sm'
              fontSize='lg'
              aria-label={`Switch to ${text} mode`}
              variant='ghost'
              color='current'
              onClick={toggleMode}
              icon={<SwitchIcon className='h-5 w-5' />}
            />
          </HStack>
        </Flex>
      </Flex>
    </>
  )
}

export const Navbar = (props: BoxProps) => {
  const bg = useColorModeValue('white', 'choc.bg')
  const ref = useRef<HTMLElement>(null)
  const [y, setY] = useState(0)
  const { height = 0 } = ref?.current?.getBoundingClientRect() ?? {}

  const { scrollY } = useViewportScroll()
  useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()))
  }, [scrollY])

  return (
    <chakra.header
      ref={ref}
      shadow={y > height ? 'md' : undefined}
      transition='all 0.5s ease-in-out'
      pos='fixed'
      top='0'
      zIndex='modal'
      bg={y > height ? bg : 'transparent'}
      left='0'
      right='0'
      borderTop='0px solid'
      borderTopColor='brand.400'
      w='full'
      {...props}
    >
      <chakra.div h='4.5rem' mx='auto'>
        <HeaderContent />
      </chakra.div>
    </chakra.header>
  )
}
