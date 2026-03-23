import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ObjectId } from 'mongodb'

const MONGO_URI = process.env.MONGO_URI ?? ''
const DB_NAME = process.env.MONGO_DB_NAME ?? 'zeabur'
const COLLECTION = 'doc_feedbacks'

let cachedClient: MongoClient | null = null

async function getClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient
  const client = new MongoClient(MONGO_URI)
  await client.connect()
  cachedClient = client
  return client
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { page, locale, rating, feedback, userId, username } = req.body

  if (!page || typeof rating !== 'number' || rating < 1 || rating > 4) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  try {
    const client = await getClient()
    const db = client.db(DB_NAME)

    await db.collection(COLLECTION).insertOne({
      page,
      locale: locale ?? null,
      rating,
      feedback: feedback ?? null,
      userId: userId ? new ObjectId(userId) : null,
      username: username ?? null,
      createdAt: new Date(),
    })

    return res.status(201).json({ ok: true })
  } catch (err) {
    console.error('Feedback insert failed:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
