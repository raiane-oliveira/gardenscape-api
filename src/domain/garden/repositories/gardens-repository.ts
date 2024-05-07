import { PaginationParams } from "@/core/repositories/pagination-params"
import { Garden, GardenVisibility } from "../entities/garden"
import { GardenDetails } from "../entities/value-objects/garden-details"

export abstract class GardensRepository {
  abstract findById(id: string): Promise<Garden | null>
  abstract findBySlug(slug: string): Promise<Garden | null>
  abstract findDetailsBySlug(slug: string): Promise<GardenDetails | null>
  abstract findManyByVisibility(
    visibility: GardenVisibility,
    params: PaginationParams,
  ): Promise<GardenDetails[]>
  abstract findManyByGardenerId(
    gardenerId: string,
    params: PaginationParams,
  ): Promise<Garden[]>
  abstract findManyDetailsByGardenerId(
    gardenerId: string,
    params: PaginationParams,
  ): Promise<GardenDetails[]>

  abstract create(garden: Garden): Promise<void>
  abstract delete(garden: Garden): Promise<void>
  abstract save(garden: Garden): Promise<void>
}
