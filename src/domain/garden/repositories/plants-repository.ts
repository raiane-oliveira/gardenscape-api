import { Plant } from "../entities/plant"

export interface PlantsRepository {
  create(plant: Plant): Promise<void>
  findByGardenId(gardenId: string): Promise<Plant[]>
}
