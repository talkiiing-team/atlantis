import { mongoClient, requestsCollection } from '@/common/db'
import { createSuccess } from '@/common/success'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ObjectId } from 'mongodb'

type MinRequest = {
    _id: ObjectId
    resolved: boolean
    createdAt: string

    // when resolved
    errorCount?: number
}

type FullRequest = MinRequest & {
    heatmap: any
}

export const requests = async (req: FastifyRequest, res: FastifyReply) => {
  const result = await requestsCollection.find({}, {
    projection: {
      resolved: 1,
      createdAt: 1,
      errorCount: 1,
    }
  }).toArray()

  return res.send(createSuccess(result))
}

