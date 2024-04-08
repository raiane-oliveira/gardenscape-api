import { PaginationParams } from "@/core/repositories/pagination-params"
import { Garden, GardenVisibility } from "@/domain/garden/entities/garden"
import { GardenDetails } from "@/domain/garden/entities/value-objects/garden-details"
import { GardensRepository } from "@/domain/garden/repositories/gardens-repository"
import { InMemoryPlantsRepository } from "./in-memory-plants-repository"
import { InMemoryGardenersRepository } from "./in-memory-gardeners-repository"

export class InMemoryGardensRepository implements GardensRepository {
  constructor(
    private plantsRepository: InMemoryPlantsRepository,
    private gardenersRepository: InMemoryGardenersRepository,
  ) {}

  items: Garden[] = []

  async findById(id: string) {
    const garden = this.items.find((item) => item.id.toString() === id)

    if (!garden) {
      return null
    }

    return garden
  }

  async findBySlug(slug: string) {
    const garden = this.items.find((item) => item.slug.value === slug)

    if (!garden) {
      return null
    }

    return garden
  }

  async findDetailsBySlug(slug: string) {
    const garden = this.items.find((item) => item.slug.value === slug)

    if (!garden) {
      return null
    }

    const plants = await this.plantsRepository.findByGardenId(
      garden.id.toString(),
    )

    const gardener = this.gardenersRepository.items.find(
      (item) => item.id.toString() === garden.gardenerId.toString(),
    )

    if (!gardener) {
      throw new Error(
        `Gardener with ID "${garden.gardenerId.toString()}" does not exists.`,
      )
    }

    return GardenDetails.create({
      gardenId: garden.id,
      gardener: {
        id: gardener.id,
        name: gardener.name,
      },
      name: garden.name,
      slug: garden.slug,
      visibility: garden.visibility,
      createdAt: garden.createdAt,
      updatedAt: garden.updatedAt,
      plants,
    })
  }

  async findManyByVisibility(
    visibility: GardenVisibility,
    params: PaginationParams,
  ) {
    const gardens = this.items
      .filter((item) => item.visibility === visibility)
      .slice((params.page - 1) * 20, params.page * 20)

    return gardens
  }

  async findManyByGardenerId(gardenerId: string, params: PaginationParams) {
    const gardens = this.items
      .filter((item) => item.gardenerId.toString() === gardenerId)
      .slice((params.page - 1) * 20, params.page * 20)

    return gardens
  }

  async create(garden: Garden) {
    this.items.push(garden)
  }

  async delete(garden: Garden) {
    const gardens = this.items.filter((item) => item.id !== garden.id)

    this.items = gardens
  }

  async save(garden: Garden) {
    const gardenIndex = this.items.findIndex((item) => item.id === garden.id)

    this.items[gardenIndex] = garden
  }
}
