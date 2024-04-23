import { Plant } from "../entities/plant"

export abstract class PlantsRepository {
  abstract create(plant: Plant): Promise<void>
  abstract findManyByGardenId(gardenId: string): Promise<Plant[]>
  abstract findByGardenId(
    plantId: string,
    gardenId: string,
  ): Promise<Plant | null>
}
