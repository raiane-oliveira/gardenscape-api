import { PlantsGarden } from '@/@types/database'
import {
  CreatePlantsGardensInput,
  PlantsGardensRepository,
} from '../contracts/plants-gardens-repository'

export class InMemoryPlantsGardensRepository
  implements PlantsGardensRepository
{
  items: PlantsGarden[] = []

  async create(data: CreatePlantsGardensInput) {
    const plantsGarden: PlantsGarden = {
      plant_id: data.plant_id,
      garden_id: data.garden_id,
      added_at: data.added_at ?? new Date(),
    }

    this.items.push(plantsGarden)

    return plantsGarden
  }

  async findByGardenId(gardenId: string) {
    const plantsGarden = this.items.find((item) => item.garden_id === gardenId)

    if (!plantsGarden) {
      return null
    }

    return plantsGarden
  }
}
