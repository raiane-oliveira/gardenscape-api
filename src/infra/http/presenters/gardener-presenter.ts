import { Gardener } from "@/domain/garden/entities/gardener"

export class GardenerPresenter {
  static toHttp(gardener: Gardener) {
    const avatarUrl = gardener.imageUrl
      ? process.env.AWS_BASE_IMAGE_URL?.concat(`/${gardener.imageUrl}`)
      : null

    return {
      id: gardener.id.toString(),
      name: gardener.name,
      email: gardener.email,
      avatar: avatarUrl,
      username: gardener.username,
      createdAt: gardener.createdAt,
      updatedAt: gardener.updatedAt,
    }
  }
}
