import { Plant } from "@/domain/garden/entities/plant"

export class PlantPresenter {
  static toHttp(plant: Plant) {
    return {
      id: plant.id.toString(),
      plantUrl: plant.plantUrl,
      plantId: plant.plantId ?? null,
      gardenId: plant.gardenId,
      plantedAt: plant.plantedAt,
    }
  }
}
