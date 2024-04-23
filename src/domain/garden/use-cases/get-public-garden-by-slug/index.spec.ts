import { InMemoryGardensRepository } from "@/test/repositories/in-memory-gardens-repository"
import { GetPublicGardenBySlugUseCase } from "."
import { makeGarden } from "@/test/factories/make-garden"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { Slug } from "../../entities/value-objects/slug"
import { InMemoryPlantsRepository } from "@/test/repositories/in-memory-plants-repository"
import { InMemoryGardenersRepository } from "@/test/repositories/in-memory-gardeners-repository"
import { makeGardener } from "@/test/factories/make-gardener"
import { makePlant } from "@/test/factories/make-plant"

let plantsRepository: InMemoryPlantsRepository
let gardenersRepository: InMemoryGardenersRepository
let gardensRepository: InMemoryGardensRepository
let sut: GetPublicGardenBySlugUseCase

describe("Get Public Garden by Slug use Case", () => {
  beforeEach(() => {
    plantsRepository = new InMemoryPlantsRepository()
    gardenersRepository = new InMemoryGardenersRepository(
      gardensRepository,
      plantsRepository,
    )
    gardensRepository = new InMemoryGardensRepository(
      plantsRepository,
      gardenersRepository,
    )
    sut = new GetPublicGardenBySlugUseCase(gardensRepository)
  })

  it("should be able to get a public garden by slug", async () => {
    const gardener = makeGardener()
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
      slug: "garden-01",
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.garden).toEqual(
        expect.objectContaining({
          slug: Slug.create("garden-01"),
          plants: expect.arrayContaining([
            expect.objectContaining({
              plantId: plant.plantId,
            }),
            expect.objectContaining({
              plantId: plant2.plantId,
            }),
          ]),
        }),
      )
    }
  })

  it("should not be able to get a private garden", async () => {
    gardenersRepository.create(makeGardener({}, new UniqueEntityId("user-01")))

    gardensRepository.create(
      makeGarden(
        {
          visibility: "private",
          slug: Slug.create("garden-01"),
          gardenerId: new UniqueEntityId("user-01"),
        },
        new UniqueEntityId("garden-01"),
      ),
    )

    const result = await sut.execute({
      slug: "garden-01",
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value.constructor).toEqual(NotAllowedError)
    }
  })
})
