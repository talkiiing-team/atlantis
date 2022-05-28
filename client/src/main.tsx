import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import './index.css'
import { RecoilRoot } from 'recoil'
import { TablePage } from '@/pages/TablePage'
import { SearchPage } from '@/pages/SearchPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />}>
              <Route index element={<TablePage />} />
              <Route path='search' element={<SearchPage />} />
              <Route path='*' element={<></>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </ChakraProvider>
  </React.StrictMode>,
)
