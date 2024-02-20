import { Garden, GardenCreateInput } from '@/@types/database'

export interface GardenInput extends GardenCreateInput {
  id?: string
  created_at?: Date
}

export interface GardensRepository {
  create: (data: GardenInput) => Promise<Garden>
  findById: (id: string) => Promise<Garden | null>
}
