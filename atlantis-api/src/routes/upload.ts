import { FastifyReply, FastifyRequest } from 'fastify'
import { createError } from '@/common/error'
import { writeFile, mkdir } from 'fs/promises'
import { resolve } from 'path'
import { createSuccess } from '@/common/success'
import { requestsCollection } from '@/common/db'

const resolveDir = (...args: string[]) =>
  resolve(__dirname, '../../data/', ...args)

export const upload = async (req: FastifyRequest, res: FastifyReply) => {
  if (!req.isMultipart()) {
    return res.status(400).send(createError('Cannot find files in the request'))
  }

  const parts = req.files()

  const { insertedId } = await requestsCollection.insertOne({})

  await mkdir(resolveDir(insertedId.toString()), { recursive: true })

  const writtenFiles: string[] = []
  for await (const part of parts) {
    const path = resolveDir(insertedId.toString(), part.fieldname)

    await writeFile(path, part.file)
    writtenFiles.push(part.fieldname)
  }

  await requestsCollection.updateOne(
    {
      _id: insertedId,
    },
    {
      $set: {
        writtenFiles,
        resolved: false,
      },
    },
  )

  return res.send(
    createSuccess({
      insertedId,
      writtenFiles,
    }),
  )
}
