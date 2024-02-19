import { Garden } from '@/@types/database'
import { GardenInput, GardensRepository } from '../contracts/gardens-repository'
import { randomUUID } from 'crypto'

export class InMemoryGardensRepository implements GardensRepository {
  items: Garden[] = []

  async create(data: GardenInput) {
    const garden: Garden = {
      id: data.id ?? randomUUID(),
      name: data.name,
      user_id: data.user_id,
      created_at: data.created_at ?? new Date(),
    }

    this.items.push(garden)

    return garden
  }
}
