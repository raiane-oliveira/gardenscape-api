import { Plant } from "../entities/plant"

export abstract class PlantsRepository {
  abstract create(plant: Plant): Promise<void>
  abstract findManyByGardenId(gardenId: string): Promise<Plant[]>
}
