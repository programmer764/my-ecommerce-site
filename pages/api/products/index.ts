// pages/api/products/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongo'
<<<<<<< HEAD
import { getRedis } from '@/lib/redis'
import { z } from 'zod'

=======
import { z } from 'zod'

// Схема валидации query-параметров
>>>>>>> cc41e0a0c9e2b090d86a2fa6331f305cd0e97bf8
const querySchema = z.object({
  search: z.string().max(100).optional(),
  categorySlug: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  compressor: z.string().max(100).optional(),
  remoteControl: z.enum(['true', 'false']).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minArea: z.coerce.number().nonnegative().optional(),
  maxArea: z.coerce.number().nonnegative().optional(),
  minHeat: z.coerce.number().nonnegative().optional(),
  maxHeat: z.coerce.number().nonnegative().optional(),
  minCool: z.coerce.number().nonnegative().optional(),
  maxCool: z.coerce.number().nonnegative().optional(),
  minNoise: z.coerce.number().nonnegative().optional(),
  maxNoise: z.coerce.number().nonnegative().optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

<<<<<<< HEAD
  const parsed = querySchema.safeParse(req.query)
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Некорректные параметры',
      errors: parsed.error.errors,
    })
  }

  const cacheKey = `products:${JSON.stringify(parsed.data)}`

  const redis = await getRedis()
  try {
    const cachedData = await redis.get(cacheKey)
    if (cachedData) {
      console.log('Cache HIT for', cacheKey)
      return res.status(200).json(JSON.parse(cachedData))
    }
  } catch (err) {
    console.error('Redis GET error:', err)
=======
  // ✅ Validate query
  const parsed = querySchema.safeParse(req.query)
  if (!parsed.success) {
    return res.status(400).json({ message: 'Некорректные параметры', errors: parsed.error.errors })
>>>>>>> cc41e0a0c9e2b090d86a2fa6331f305cd0e97bf8
  }

  const {
    search,
    categorySlug,
    brand,
    country,
    compressor,
    remoteControl,
<<<<<<< HEAD
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    minHeat,
    maxHeat,
    minCool,
    maxCool,
    minNoise,
    maxNoise,
=======
    minPrice, maxPrice,
    minArea,   maxArea,
    minHeat,   maxHeat,
    minCool,   maxCool,
    minNoise,  maxNoise,
>>>>>>> cc41e0a0c9e2b090d86a2fa6331f305cd0e97bf8
    page,
  } = parsed.data

  const skip = (page - 1) * 15
  const limit = 15

  const client = await clientPromise
  const coll = client.db('dbcom').collection('dbcom2')

  const andConditions: any[] = []

<<<<<<< HEAD
  if (categorySlug && categorySlug !== 'Все') andConditions.push({ categorySlug })
  if (search) andConditions.push({ name: { $regex: search.trim(), $options: 'i' } })
  if (brand && brand !== 'Все') {
    andConditions.push({
      characteristics: { $elemMatch: { name: 'Производитель', value: brand } },
=======
  if (categorySlug && categorySlug !== 'Все') {
    andConditions.push({ categorySlug })
  }
  if (search) {
    andConditions.push({ name: { $regex: search.trim(), $options: 'i' } })
  }
  if (brand && brand !== 'Все') {
    andConditions.push({
      characteristics: {
        $elemMatch: { name: 'Производитель', value: brand }
      }
>>>>>>> cc41e0a0c9e2b090d86a2fa6331f305cd0e97bf8
    })
  }
  if (country && country !== 'Все') {
    andConditions.push({
<<<<<<< HEAD
      characteristics: { $elemMatch: { name: 'Страна бренда', value: country } },
=======
      characteristics: {
        $elemMatch: { name: 'Страна бренда', value: country }
      }
>>>>>>> cc41e0a0c9e2b090d86a2fa6331f305cd0e97bf8
    })
  }
  if (compressor && compressor !== 'Все') {
    andConditions.push({
<<<<<<< HEAD
      characteristics: { $elemMatch: { name: 'Компрессор', value: compressor } },
=======
      characteristics: {
        $elemMatch: { name: 'Компрессор', value: compressor }
      }
>>>>>>> cc41e0a0c9e2b090d86a2fa6331f305cd0e97bf8
    })
  }
  if (remoteControl === 'true') {
    andConditions.push({
      characteristics: {
        $elemMatch: {
          name: 'Пульт дистанционного управления',
<<<<<<< HEAD
          value: 'Есть',
        },
      },
=======
          value: 'Есть'
        }
      }
>>>>>>> cc41e0a0c9e2b090d86a2fa6331f305cd0e97bf8
    })
  }
  if (minPrice || maxPrice) {
    const priceFilter: any = {}
    if (minPrice) priceFilter.$gte = minPrice
    if (maxPrice) priceFilter.$lte = maxPrice
    andConditions.push({ price: priceFilter })
  }

  const pipeline: any[] = []

  if (andConditions.length > 0) {
    pipeline.push({ $match: { $and: andConditions } })
  }

  const makeNumericField = (charName: string, asField: string) => ({
    $addFields: {
      [asField]: {
        $let: {
          vars: {
            rf: {
              $regexFind: {
                input: {
                  $first: {
                    $map: {
                      input: {
                        $filter: {
                          input: '$characteristics',
                          as: 'c',
<<<<<<< HEAD
                          cond: { $eq: ['$$c.name', charName] },
                        },
                      },
                      as: 'x',
                      in: '$$x.value',
                    },
                  },
                },
                regex: '[0-9]+(?:[\\.,][0-9]+)?',
              },
            },
=======
                          cond: { $eq: ['$$c.name', charName] }
                        }
                      },
                      as: 'x',
                      in: '$$x.value'
                    }
                  }
                },
                regex: '[0-9]+(?:[\\.,][0-9]+)?'
              }
            }
>>>>>>> cc41e0a0c9e2b090d86a2fa6331f305cd0e97bf8
          },
          in: {
            $toDouble: {
              $replaceAll: {
                input: '$$rf.match',
                find: ',',
<<<<<<< HEAD
                replacement: '.',
              },
            },
          },
        },
      },
    },
=======
                replacement: '.'
              }
            }
          }
        }
      }
    }
>>>>>>> cc41e0a0c9e2b090d86a2fa6331f305cd0e97bf8
  })

  pipeline.push(makeNumericField('Площадь помещения, кв.м.', 'areaNum'))
  pipeline.push(makeNumericField('Обогрев, кВт', 'heatNum'))
  pipeline.push(makeNumericField('Охлаждение, кВт', 'coolNum'))
  pipeline.push(makeNumericField('Уровень шума внут. блока, дБ', 'noiseNum'))

  const numMatch: any = {}
<<<<<<< HEAD
  if (minArea || maxArea)
    numMatch.areaNum = {
      ...(minArea ? { $gte: minArea } : {}),
      ...(maxArea ? { $lte: maxArea } : {}),
    }
  if (minHeat || maxHeat)
    numMatch.heatNum = {
      ...(minHeat ? { $gte: minHeat } : {}),
      ...(maxHeat ? { $lte: maxHeat } : {}),
    }
  if (minCool || maxCool)
    numMatch.coolNum = {
      ...(minCool ? { $gte: minCool } : {}),
      ...(maxCool ? { $lte: maxCool } : {}),
    }
  if (minNoise || maxNoise)
    numMatch.noiseNum = {
      ...(minNoise ? { $gte: minNoise } : {}),
      ...(maxNoise ? { $lte: maxNoise } : {}),
    }
=======
  if (minArea || maxArea) numMatch.areaNum = {
    ...(minArea ? { $gte: minArea } : {}),
    ...(maxArea ? { $lte: maxArea } : {})
  }
  if (minHeat || maxHeat) numMatch.heatNum = {
    ...(minHeat ? { $gte: minHeat } : {}),
    ...(maxHeat ? { $lte: maxHeat } : {})
  }
  if (minCool || maxCool) numMatch.coolNum = {
    ...(minCool ? { $gte: minCool } : {}),
    ...(maxCool ? { $lte: maxCool } : {})
  }
  if (minNoise || maxNoise) numMatch.noiseNum = {
    ...(minNoise ? { $gte: minNoise } : {}),
    ...(maxNoise ? { $lte: maxNoise } : {})
  }
>>>>>>> cc41e0a0c9e2b090d86a2fa6331f305cd0e97bf8

  if (Object.keys(numMatch).length > 0) {
    pipeline.push({ $match: numMatch })
  }

  pipeline.push({
    $facet: {
      data: [{ $skip: skip }, { $limit: limit }],
<<<<<<< HEAD
      count: [{ $count: 'total' }],
    },
  })

  const [agg] = await coll.aggregate(pipeline).toArray()
  const result = {
    products: agg.data,
    totalCount: agg.count[0]?.total || 0,
  }

  try {
    await redis.setEx(cacheKey, 3600, JSON.stringify(result))
    console.log('Cache SET for', cacheKey)
  } catch (err) {
    console.error('Redis SET error:', err)
  }

  return res.status(200).json(result)
}
=======
      count: [{ $count: 'total' }]
    }
  })

  const [agg] = await coll.aggregate(pipeline).toArray()
  const products = agg.data
  const totalCount = agg.count[0]?.total || 0

  return res.status(200).json({ products, totalCount })
}
  
>>>>>>> cc41e0a0c9e2b090d86a2fa6331f305cd0e97bf8
