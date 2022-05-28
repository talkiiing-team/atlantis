import { FastifyReply, FastifyRequest } from 'fastify'
import { createError } from '@/common/error'
import { writeFile, mkdir } from 'fs/promises'
import { resolve } from 'path'
import { createSuccess } from '@/common/success'
import { requestsCollection } from '@/common/db'
import { ObjectId } from 'mongodb'

const resolveDir = (...args: string[]) =>
  resolve(__dirname, '../../data/', ...args)

export const callback = async (req: FastifyRequest, res: FastifyReply) => {
  const { _id, result } = req.body as {
    _id: ObjectId
    result: any
  }

  const updated = await requestsCollection.updateOne(
    {
      _id,
    },
    {
      $set: {
        resolved: true,
        result,
      },
    },
  )

  return res.send(createSuccess(updated))
}
