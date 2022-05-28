import { MongoClient } from 'mongodb'

export const mongoClient = new MongoClient(
  process.env.MONGODB_CONNECTION_STRING ?? '',
)

export const db = mongoClient.db('requests')

export const requestsCollection = db.collection('requests')
