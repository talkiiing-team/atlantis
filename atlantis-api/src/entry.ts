process.env.NODE_ENV !== 'production' && require('dotenv').config()



import { app } from './app'
import { mongoClient } from '@/common/db'

;(async () => {
  console.log('Hello')
  console.log(process.env)
  app.printRoutes()
  await mongoClient.connect()
  await app.listen(8091, '0.0.0.0', (err, addr) => {
    if (err) return console.log(err)
    console.log('App is ready on ', addr)
  })
})()
