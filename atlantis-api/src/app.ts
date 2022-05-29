import fastify from 'fastify'
import fastifyMultipart from '@fastify/multipart'
import { upload } from '@/routes/upload'
import { requests } from '@/routes/requests'
import { request } from '@/routes/request'
import fastifyCors from '@fastify/cors'

const app = fastify()

app.register(fastifyCors)
app.register(fastifyMultipart)

app.post('/upload', upload)
app.get('/requests', requests)
app.get('/requests/:id', request)

export { app }
