import { InMemoryGardensRepository } from "@/test/repositories/in-memory-gardens-repository"
import { GetGardenerProfileUseCase } from "."
import { makeGarden } from "@/test/factories/make-garden"
import { Slug } from "../../entities/value-objects/slug"
import { InMemoryPlantsRepository } from "@/test/repositories/in-memory-plants-repository"
import { InMemoryGardenersRepository } from "@/test/repositories/in-memory-gardeners-repository"
import { makeGardener } from "@/test/factories/make-gardener"
import { makePlant } from "@/test/factories/make-plant"

let gardensRepository: InMemoryGardensRepository
let plantsRepository: InMemoryPlantsRepository
let gardenersRepository: InMemoryGardenersRepository
let sut: GetGardenerProfileUseCase

describe("Get Gardener Details use Case", () => {
  beforeEach(() => {
    plantsRepository = new InMemoryPlantsRepository()
    gardensRepository = new InMemoryGardensRepository(
      plantsRepository,
      gardenersRepository,
    )
    gardenersRepository = new InMemoryGardenersRepository(
      gardensRepository,
      plantsRepository,
    )
    sut = new GetGardenerProfileUseCase(gardenersRepository)
  })

  it("should be able to get gardener profile", async () => {
    const gardener = makeGardener({ username: "johndoe" })
    gardenersRepository.create(gardener)

    const garden = makeGarden({
      slug: Slug.create("garden-01"),
      gardenerId: gardener.id,
    })
    gardensRepository.create(garden)

    const plant = makePlant({
      gardenId: garden.id,
    })
    const plant2 = makePlant({
      gardenId: garden.id,
    })
    plantsRepository.create(plant)
    plantsRepository.create(plant2)

    const result = await sut.execute({
      username: "johndoe",
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.gardener).toEqual(
        expect.objectContaining({
          gardenerId: gardener.id,
          username: gardener.username,
          gardens: expect.arrayContaining([
            expect.objectContaining({
              name: garden.name,
            }),
          ]),
        }),
      )
    }
  })
})
