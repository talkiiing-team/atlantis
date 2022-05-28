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
        resolved: [],
        errorFields: [],
        createdAt: new Date(),
      },
    },
  )

  res.send(
    createSuccess({
      insertedId,
      writtenFiles,
    }),
  )
  
  console.log('Done with creating, getting heatmap...')


  try {
    const heatmap = await PythonClient.getHeatmap({
      catch: resolveDir(directory, 'catch.csv'),
      product: resolveDir(directory, 'product.csv'),
      ext1: resolveDir(directory, 'ext1.csv'),
      ext2: resolveDir(directory, 'ext2.csv'),
    })

    console.log('Got heatmap! Updating...')

    await requestsCollection.updateOne(
      {
        _id: insertedId,
      },
      {
        $set: {
          heatmap: heatmap.data,
          errorsCount: Object.values(heatmap.data).reduce((acc, val) => acc + ((val as Array<any>)[0] ?? 0), 0)
        },
        $push: {
          resolved: 'heatmap'
        }
      },
    )
  } catch (e) {
    console.log('Error while getting heatmap! Updating...', e)

    await requestsCollection.updateOne(
      {
        _id: insertedId,
      },
      {
        $push: {
          errorFields: 'heatmap'
        }
      },
    )
  }

  console.log('Done with heatmap, getting plots...')

  try {
    const plots = await PythonClient.getPlots({
      catch: resolveDir(directory, 'catch.csv'),
      product: resolveDir(directory, 'product.csv'),
      ext1: resolveDir(directory, 'ext1.csv'),
      ext2: resolveDir(directory, 'ext2.csv'),
    })

    console.log('Got plots! Updating...')

    await requestsCollection.updateOne(
      {
        _id: insertedId,
      },
      {
        $set: {
          plots: plots.data,
        },
        $push: {
          resolved: 'plots'
        }
      },
    )
  } catch (e) {
    console.log('Error while getting plots! Updating...', e)

    await requestsCollection.updateOne(
      {
        _id: insertedId,
      },
      {
        $push: {
          errorFields: 'plots'
        }
      },
    )
  }

  console.log('Done with heatmap, getting graph...')

  try {
    const graph = await PythonClient.getGraph({
      catch: resolveDir(directory, 'catch.csv'),
      product: resolveDir(directory, 'product.csv'),
      ext1: resolveDir(directory, 'ext1.csv'),
      ext2: resolveDir(directory, 'ext2.csv'),
    })

    console.log('Got graph! Updating...')

    await requestsCollection.updateOne(
      {
        _id: insertedId,
      },
      {
        $set: {
          plots: graph.data,
        },
        $push: {
          resolved: 'graph'
        }
      },
    )
  } catch (e) {
    console.log('Error while getting graph! Updating...', e)

    await requestsCollection.updateOne(
      {
        _id: insertedId,
      },
      {
        $push: {
          errorFields: 'graph'
        }
      },
    )
  }

  console.log('Here you go\n\n\n')
}
