import { Garden } from "@/domain/garden/entities/garden"

export class GardenPresenter {
  static toHttp(garden: Garden) {
    return {
      id: garden.id.toString(),
      slug: garden.slug.value,
      name: garden.name,
      visibility: garden.visibility,
      gardenerId: garden.gardenerId.toString(),
      createdAt: garden.createdAt,
      updatedAt: garden.updatedAt,
    }
  }
}
