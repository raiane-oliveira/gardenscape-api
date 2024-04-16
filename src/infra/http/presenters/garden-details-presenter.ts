import { GardenDetails } from "@/domain/garden/entities/value-objects/garden-details"

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
      },
      createdAt: garden.createdAt,
      updatedAt: garden.updatedAt,
    }
  }
}
