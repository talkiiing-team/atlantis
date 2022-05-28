import fastify from 'fastify'
import fastifyMultipart from '@fastify/multipart'
import { upload } from '@/routes/upload'
import { callback } from '@/routes/callback'
import fastifyCors from '@fastify/cors'

const app = fastify()

app.register(fastifyCors)
app.register(fastifyMultipart)

app.post('/upload', upload)
app.post('/__callback', callback)

export { app }
