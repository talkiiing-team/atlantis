import { app } from './app'
import { mongoClient } from '@/common/db'

require('dotenv').config()
;(async () => {
  app.printRoutes()
  await mongoClient.connect()
  await app.listen(9999, () => {
    console.log('App listening on http://localhost:9999')
  })
})()
