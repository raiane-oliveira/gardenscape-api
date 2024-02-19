import { env } from '@/env/index'
import { Pool } from 'pg'

export const db = new Pool({
  max: 20,
  connectionString: env.DATABASE_URL,
  idleTimeoutMillis: 30 * 1000, // 30 minutes
})

await db.connect()

db.on('error', (err) => {
  console.error(err)
})
