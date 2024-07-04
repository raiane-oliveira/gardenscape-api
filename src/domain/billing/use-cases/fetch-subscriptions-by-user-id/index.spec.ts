import { FakePaymentGateway } from "@/test/payment/fake-gateway"
import { FetchSubscriptionsByUserIdUseCase } from "."
import { InMemorySubscriptionsRepository } from "@/test/repositories/in-memory-subscriptions-repository"
import { makeSubscription } from "@/test/factories/make-subscription"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

let paymentGateway: FakePaymentGateway
let sut: FetchSubscriptionsByUserIdUseCase
let subscriptionsRepository: InMemorySubscriptionsRepository

describe("Fetch Subscriptions by User Id Use Case", () => {
  beforeEach(() => {
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    paymentGateway = new FakePaymentGateway(subscriptionsRepository)
    sut = new FetchSubscriptionsByUserIdUseCase(
      paymentGateway,
      subscriptionsRepository,
    )
  })

  it("should be able to fetch subscriptions by user id", async () => {
    subscriptionsRepository.create(
      makeSubscription(
        {
          userId: new UniqueEntityId("user-01"),
          customerId: "customer-01",
        },
        new UniqueEntityId("sub-01"),
      ),
    )

    subscriptionsRepository.create(
      makeSubscription(
        {
          userId: new UniqueEntityId("user-01"),
          customerId: "customer-01",
        },
        new UniqueEntityId("sub-02"),
      ),
    )

    const result = await sut.execute({
      userId: "user-01",
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.subscriptions).toHaveLength(2)
      expect(result.value.subscriptions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            subscriptionId: "sub-01",
            userId: new UniqueEntityId("user-01"),
            product: expect.objectContaining({
              id: new UniqueEntityId("product-01"),
              features: expect.arrayContaining([
                expect.objectContaining({
                  name: expect.any(String),
                }),
              ]),
            }),
          }),
        ]),
      )
    }
  })
})
