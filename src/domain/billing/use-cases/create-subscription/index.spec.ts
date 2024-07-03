import { InMemorySubscriptionsRepository } from "@/test/repositories/in-memory-subscriptions-repository"
import { CreateSubscriptionUseCase } from "."
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

let subscriptionsRepository: InMemorySubscriptionsRepository
let sut: CreateSubscriptionUseCase

describe("Create Subscription Use Case", () => {
  beforeEach(() => {
    subscriptionsRepository = new InMemorySubscriptionsRepository()

    sut = new CreateSubscriptionUseCase(subscriptionsRepository)
  })

  it("should be able to register a gardener", async () => {
    const result = await sut.execute({
      productId: "product-01",
      userId: "user-01",
      active: true,
    })

    expect(result.isRight()).toEqual(true)

    if (result.isRight()) {
      expect(result.value.subscription).toEqual(
        expect.objectContaining({
          productId: new UniqueEntityId("product-01"),
          userId: new UniqueEntityId("user-01"),
        }),
      )
    }

    expect(subscriptionsRepository.items).toHaveLength(1)
  })
})
