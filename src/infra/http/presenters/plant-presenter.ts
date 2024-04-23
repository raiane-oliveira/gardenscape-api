import { Plant } from "@/domain/garden/entities/plant"

export class PlantPresenter {
  static toHttp(plant: Plant) {
    return {
      id: plant.id.toString(),
      plantId: plant.plantId,
      gardenId: plant.gardenId,
      plantedAt: plant.plantedAt,
    }
  }
}
