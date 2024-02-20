import { Plant, PlantCreateInput } from '@/@types/database'

export interface CreatePlantInput extends PlantCreateInput {
  id?: number
}

export interface PlantsRepository {
  create: (data: CreatePlantInput) => Promise<Plant>
  findById: (apiPlantId: number) => Promise<Plant | null>
}
