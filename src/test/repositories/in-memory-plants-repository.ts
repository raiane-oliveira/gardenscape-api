import { Plant } from "@/domain/garden/entities/plant"
import { PlantsRepository } from "@/domain/garden/repositories/plants-repository"

export class InMemoryPlantsRepository implements PlantsRepository {
  public items: Plant[] = []

  async create(plant: Plant) {
    this.items.push(plant)
  }

  async findManyByGardenId(gardenId: string) {
    const plants = this.items.filter(
      (item) => item.gardenId.toString() === gardenId,
    )

    return plants
  }

  async findByGardenId(plantId: string, gardenId: string) {
    const plant = this.items.find(
      (item) =>
        item.plantId === plantId && item.gardenId.toString() === gardenId,
    )

    if (!plant) return null

    return plant
  }
}
