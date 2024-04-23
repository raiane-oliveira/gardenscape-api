import { InMemoryGardenersRepository } from "@/test/repositories/in-memory-gardeners-repository"
import { RegisterGardenerUseCase } from "."
import { FakeHasher } from "@/test/cryptography/fake-hasher"
import { GardenerAlreadyExistsError } from "@/core/errors/gardener-already-exists-error"
import { InMemoryGardensRepository } from "@/test/repositories/in-memory-gardens-repository"
import { InMemoryPlantsRepository } from "@/test/repositories/in-memory-plants-repository"

let fakeHasher: FakeHasher
let gardenersRepository: InMemoryGardenersRepository
let gardensRepository: InMemoryGardensRepository
let plantsRepository: InMemoryPlantsRepository
let sut: RegisterGardenerUseCase

describe("Register Gardener Use Case", () => {
  beforeEach(() => {
    gardenersRepository = new InMemoryGardenersRepository(
      gardensRepository,
      plantsRepository,
    )
    fakeHasher = new FakeHasher()
    sut = new RegisterGardenerUseCase(gardenersRepository, fakeHasher)
  })

  it("should be able to register a gardener", async () => {
    const result = await sut.execute({
      name: "John doe",
      username: "johndoe",
      email: "johndoe@example.com",
      password: "123456",
    })

    expect(result.isRight()).toEqual(true)

    if (result.isRight()) {
      expect(result.value.gardener).toEqual(
        expect.objectContaining({
          name: "John doe",
        }),
      )
    }

    expect(gardenersRepository.items).toHaveLength(1)
  })

  it("should not be able to register a gardener with duplicate email", async () => {
    await sut.execute({
      name: "John doe",
      username: "johndoe",
      email: "johndoe@example.com",
      password: "123456",
    })

    const result = await sut.execute({
      name: "John doe",
      username: "johndoe1",
      email: "johndoe@example.com",
      password: "123456",
    })

    expect(result.isLeft()).toEqual(true)

    if (result.isLeft()) {
      expect(result.value.constructor).toBe(GardenerAlreadyExistsError)
      expect(result.value.message).toEqual(
        `Gardener "johndoe@example.com" already exists.`,
      )
    }
  })

  it("should not be able to register a gardener with duplicate username", async () => {
    await sut.execute({
      name: "John doe",
      username: "johndoe",
      email: "johndoe@example.com",
      password: "123456",
    })

    const result = await sut.execute({
      name: "John doe",
      username: "johndoe",
      email: "johndoe1@example.com",
      password: "123456",
    })

    expect(result.isLeft()).toEqual(true)

    if (result.isLeft()) {
      expect(result.value.constructor).toBe(GardenerAlreadyExistsError)
      expect(result.value.message).toEqual(`Gardener "johndoe" already exists.`)
    }
  })

  it("should be able to hash gardener password", async () => {
    const result = await sut.execute({
      name: "John doe",
      username: "johndoe",
      email: "johndoe1@example.com",
      password: "123456",
    })

    expect(result.isRight()).toEqual(true)

    if (result.isRight()) {
      expect(gardenersRepository.items[0].password).toEqual("123456-hashed")
    }
  })
})
