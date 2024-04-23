import { GardenDetails } from "@/domain/garden/entities/value-objects/garden-details"
import { PlantPresenter } from "./plant-presenter"

export class GardenDetailsPresenter {
  static toHttp(garden: GardenDetails) {
    return {
      id: garden.gardenId.toString(),
      slug: garden.slug.value,
      name: garden.name,
      visibility: garden.visibility,
      gardener: {
        id: garden.gardener.id.toString(),
        name: garden.gardener.name,
        username: garden.gardener.username,
      },
      plants: garden.plants.map(PlantPresenter.toHttp),
      createdAt: garden.createdAt,
      updatedAt: garden.updatedAt,
    }
  }
}
