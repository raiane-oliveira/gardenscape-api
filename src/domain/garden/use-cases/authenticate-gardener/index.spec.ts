import { InMemoryGardenersRepository } from "@/test/repositories/in-memory-gardeners-repository"
import { AuthenticateGardenerUseCase } from "."
import { FakeHasher } from "@/test/cryptography/fake-hasher"
import { makeGardener } from "@/test/factories/make-gardener"
import { InvalidCredentialsError } from "@/core/errors/invalid-credentials-error"

let fakeHasher: FakeHasher
let gardenersRepository: InMemoryGardenersRepository
let sut: AuthenticateGardenerUseCase

describe("Authenticate Gardener Use Case", () => {
  beforeEach(() => {
    gardenersRepository = new InMemoryGardenersRepository()
    fakeHasher = new FakeHasher()
    sut = new AuthenticateGardenerUseCase(gardenersRepository, fakeHasher)
  })

  it("should be able to authenticate a gardener", async () => {
    gardenersRepository.create(
      makeGardener({
        username: "johndoe",
        password: await fakeHasher.hash("123456"),
      }),
    )

    const result = await sut.execute({
      username: "johndoe",
      password: "123456",
    })

    expect(result.isRight()).toEqual(true)

    if (result.isRight()) {
      expect(result.value.gardener).toEqual(
        expect.objectContaining({
          username: "johndoe",
        }),
      )
    }

    expect(gardenersRepository.items).toHaveLength(1)
  })

  it("should not be able to authenticate a gardener with invalid username", async () => {
    gardenersRepository.create(
      makeGardener({
        password: await fakeHasher.hash("123456"),
      }),
    )

    const result = await sut.execute({
      username: "johndoe",
      password: "123456",
    })

    expect(result.isLeft()).toEqual(true)

    if (result.isLeft()) {
      expect(result.value.constructor).toBe(InvalidCredentialsError)
    }
  })

  it("should not be able to register a gardener with wrong password", async () => {
    gardenersRepository.create(
      makeGardener({
        username: "johndoe",
      }),
    )

    const result = await sut.execute({
      username: "johndoe",
      password: "123456",
    })

    expect(result.isLeft()).toEqual(true)

    if (result.isLeft()) {
      expect(result.value.constructor).toBe(InvalidCredentialsError)
    }
  })
})
