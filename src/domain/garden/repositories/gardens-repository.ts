import { PaginationParams } from "@/core/repositories/pagination-params"
import { Garden, GardenVisibility } from "../entities/garden"
import { GardenDetails } from "../entities/value-objects/garden-details"

export interface GardensRepository {
  findById(id: string): Promise<Garden | null>
  findBySlug(slug: string): Promise<Garden | null>
  findDetailsBySlug(slug: string): Promise<GardenDetails | null>
  findManyByVisibility(
    visibility: GardenVisibility,
    params: PaginationParams,
  ): Promise<Garden[]>
  findManyByGardenerId(
    gardenerId: string,
    params: PaginationParams,
  ): Promise<Garden[]>

  create(garden: Garden): Promise<void>
  delete(garden: Garden): Promise<void>
  save(garden: Garden): Promise<void>
}
