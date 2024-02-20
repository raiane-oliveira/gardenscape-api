import { PlantsGarden, PlantsGardenCreateInput } from '@/@types/database'

export interface CreatePlantsGardensInput extends PlantsGardenCreateInput {
  added_at?: Date
}

export interface PlantsGardensRepository {
  create: (data: CreatePlantsGardensInput) => Promise<PlantsGarden>
  findByGardenId: (gardenId: string) => Promise<PlantsGarden | null>
}
