import { Plant } from '@/@types/database'
import {
  CreatePlantInput,
  PlantsRepository,
} from '../contracts/plants-repository'
import { randomInt } from 'crypto'

export class InMemoryPlantsRepository implements PlantsRepository {
  items: Plant[] = []

  async create(data: CreatePlantInput) {
    const plant: Plant = {
      id: data.id ?? randomInt(100),
      name: data.name,
      api_plant_id: data.api_plant_id,
    }

    this.items.push(plant)

    return plant
  }

  async findById(id: number) {
    const plant = this.items.find((item) => item.api_plant_id === id)

    if (!plant) {
      return null
    }

    return plant
  }

  async findByApiId(apiPlantId: number) {
    const plant = this.items.find((item) => item.api_plant_id === apiPlantId)

    if (!plant) {
      return null
    }

    return plant
  }
}
