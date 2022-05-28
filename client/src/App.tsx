import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { useEffect, useRef } from 'react'
import { withApp } from '@/hoc/withApp'
import { Navbar } from '@/components/Navbar'

const App = withApp(({ app }) => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className='h-full w-full'>
      <Navbar />
      <Outlet />
    </div>
  )
})

export default App
