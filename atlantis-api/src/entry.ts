import { app } from './app'
import { mongoClient } from '@/common/db'

require('dotenv').config()
;(async () => {
  console.log('Hello')
  app.printRoutes()
  await mongoClient.connect()
  await app.listen(8091, '0.0.0.0', (err, addr) => {
    if (err) return console.log(err)
    console.log('App is ready on ', addr)
  })
})()
