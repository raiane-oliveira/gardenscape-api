import { Gardener } from "@/domain/garden/entities/gardener"
import { GardenerDetails } from "@/domain/garden/entities/value-objects/gardener-details"
import { GardenersRepository } from "@/domain/garden/repositories/gardeners-repository"
import { InMemoryGardensRepository } from "./in-memory-gardens-repository"
import { InMemoryPlantsRepository } from "./in-memory-plants-repository"
import { GardenDetails } from "@/domain/garden/entities/value-objects/garden-details"

export class InMemoryGardenersRepository implements GardenersRepository {
  constructor(
    private gardensRepository: InMemoryGardensRepository,
    private plantsRepository: InMemoryPlantsRepository,
  ) {}

  public items: Gardener[] = []

  async create(gardener: Gardener) {
    this.items.push(gardener)
  }

  async findByEmail(email: string) {
    const gardener = this.items.find((item) => item.email === email)

    if (!gardener) {
      return null
    }

    return gardener
  }

  async findByUsername(username: string) {
    const gardener = this.items.find((item) => item.username === username)

    if (!gardener) {
      return null
    }

    return gardener
  }

  async findDetailsByUsername(username: string) {
    const gardener = this.items.find((item) => item.username === username)

    if (!gardener) {
      return null
    }

    const gardens = this.gardensRepository.items.filter(
      (item) => item.gardenerId === gardener.id,
    )

    const gardenDetails = gardens.map((garden) => {
      const plants = this.plantsRepository.items.filter(
        (item) => item.gardenId.toString() === garden.id.toString(),
      )

      return GardenDetails.create({
        gardenId: garden.id,
        name: garden.name,
        slug: garden.slug,
        gardener: {
          id: gardener.id,
          name: gardener.name,
          username: gardener.username,
        },
        visibility: garden.visibility,
        plants,
        createdAt: garden.createdAt,
        updatedAt: garden.updatedAt,
      })
    })

    return GardenerDetails.create({
      gardenerId: gardener.id,
      name: gardener.name,
      username: gardener.username,
      email: gardener.email,
      createdAt: gardener.createdAt,
      updatedAt: gardener.updatedAt,
      gardens: gardenDetails,
    })
  }
}
