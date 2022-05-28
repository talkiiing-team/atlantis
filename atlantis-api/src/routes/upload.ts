import { FastifyReply, FastifyRequest } from 'fastify'
import { createError } from '@/common/error'
import { writeFile, mkdir } from 'fs/promises'
import { resolve } from 'path'
import { createSuccess } from '@/common/success'
import { requestsCollection } from '@/common/db'
import { PythonClient } from '@/common/python'

const resolveDir = (...args: string[]) =>
  resolve(__dirname, '../../data/', ...args)

export const upload = async (req: FastifyRequest, res: FastifyReply) => {
  if (!req.isMultipart()) {
    return res.status(400).send(createError('Cannot find files in the request'))
  }

  const parts = req.files()

  const { insertedId } = await requestsCollection.insertOne({})

  const directory = resolveDir(insertedId.toString())

  await mkdir(directory, { recursive: true })

  const writtenFiles: string[] = []
  for await (const part of parts) {
    const path = resolveDir(directory, part.fieldname)

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

  res.send(
    createSuccess({
      insertedId,
      writtenFiles,
    }),
  )

  const heatmap = await PythonClient.getHeatmap({
    catch: resolveDir(directory, 'catch.csv'),
    product: resolveDir(directory, 'product.csv'),
    ext1: resolveDir(directory, 'ext1.csv'),
    ext2: resolveDir(directory, 'ext2.csv'),
  })

  await requestsCollection.updateOne(
    {
      _id: insertedId,
    },
    {
      $set: {
        resolved: true,
        heatmap,
      },
    },
  )
}
