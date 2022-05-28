import { FastifyReply, FastifyRequest } from 'fastify'
import { ObjectId } from 'mongodb'
import { createSuccess } from '@/common/success'
import { requestsCollection } from '@/common/db'
import { createError } from '@/common/error'

export const request = async (req: FastifyRequest, res: FastifyReply) => {
  // @ts-ignore
  if (!req.params.id) {
    return res.status(400).send(createError('No id provided'))
  }

  const queryOptions =
    req.query && typeof req.query === 'object' && 'fields[]' in req.query ? {
      projection: 
        // @ts-ignore
        typeof req.query['fields[]'] === 'string' ? {
          // @ts-ignore
          [req.query['fields[]']]: 1
        } :
        // @ts-ignore
        (req.query['fields[]'] as string[]).reduce((acc, val) => ({ ...acc, [val]: 1 }), {})
    } : {}

  const result = await requestsCollection.findOne({
    // @ts-ignore
    _id: ObjectId(req.params.id),
  }, queryOptions)

  if (!result) {
    // @ts-ignore
    return res.status(404).send(createError('Not found', { id: req.params.id }))
  }

  return res.send(createSuccess(result))
}
