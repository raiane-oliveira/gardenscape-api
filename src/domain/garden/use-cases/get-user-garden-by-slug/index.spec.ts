import { InMemoryGardensRepository } from "@/test/repositories/in-memory-gardens-repository"
import { GetUserGardenBySlugUseCase } from "."
import { makeGarden } from "@/test/factories/make-garden"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { Slug } from "../../entities/value-objects/slug"
import { InMemoryPlantsRepository } from "@/test/repositories/in-memory-plants-repository"
import { InMemoryGardenersRepository } from "@/test/repositories/in-memory-gardeners-repository"
import { makeGardener } from "@/test/factories/make-gardener"
import { makePlant } from "@/test/factories/make-plant"

let gardensRepository: InMemoryGardensRepository
let plantsRepository: InMemoryPlantsRepository
let gardenersRepository: InMemoryGardenersRepository
let sut: GetUserGardenBySlugUseCase

describe("Get User Garden by Slug use Case", () => {
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
    sut = new GetUserGardenBySlugUseCase(gardensRepository)
  })

  it("should be able to get user garden by slug", async () => {
    const gardener = makeGardener({ name: "John Doe" })
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
      gardenerId: gardener.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.garden).toEqual(
        expect.objectContaining({
          slug: Slug.create("garden-01"),
          gardener: expect.objectContaining({
            id: gardener.id,
          }),
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

  it("should not be able to get a garden from another user", async () => {
    gardenersRepository.create(makeGardener({}, new UniqueEntityId("user-01")))
    gardenersRepository.create(
      makeGardener({}, new UniqueEntityId("another-user")),
    )

    gardensRepository.create(
      makeGarden({
        visibility: "private",
        slug: Slug.create("garden-01"),
        gardenerId: new UniqueEntityId("user-01"),
      }),
    )

    const result = await sut.execute({
      slug: "garden-01",
      gardenerId: "another-user",
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value.constructor).toEqual(NotAllowedError)
    }
  })
})
