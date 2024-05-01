import { GardenerDetails } from "@/domain/garden/entities/value-objects/gardener-details"
import { GardenDetailsPresenter } from "./garden-details-presenter"

export class GardenerDetailsPresenter {
  static toHttp(gardener: GardenerDetails) {
    const avatarUrl = gardener.imageUrl
      ? process.env.AWS_BASE_IMAGE_URL?.concat(`/${gardener.imageUrl}`)
      : null

    return {
      id: gardener.gardenerId.toString(),
      name: gardener.name,
      email: gardener.email,
      avatar: avatarUrl,
      username: gardener.username,
      createdAt: gardener.createdAt,
      updatedAt: gardener.updatedAt,
      gardens: gardener.gardens.map(GardenDetailsPresenter.toHttp),
    }
  }
}
