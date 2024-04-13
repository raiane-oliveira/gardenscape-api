import { GardenerDetails } from "@/domain/garden/entities/value-objects/gardener-details"
import { GardenPresenter } from "./garden-presenter"

export class GardenerDetailsPresenter {
  static toHttp(gardener: GardenerDetails) {
    return {
      id: gardener.gardenerId.toString(),
      name: gardener.name,
      email: gardener.email,
      username: gardener.username,
      createdAt: gardener.createdAt,
      updatedAt: gardener.updatedAt,
      gardens: gardener.gardens.map(GardenPresenter.toHttp),
    }
  }
}
