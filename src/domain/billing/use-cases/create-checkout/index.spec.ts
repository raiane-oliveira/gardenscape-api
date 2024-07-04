import { FakePaymentGateway } from "@/test/payment/fake-gateway"
import { CreateCheckoutUseCase } from "."
import { InMemorySubscriptionsRepository } from "@/test/repositories/in-memory-subscriptions-repository"
import { makeGardener } from "@/test/factories/make-gardener"

let fakePaymentGateway: FakePaymentGateway
let subscriptionsRepository: InMemorySubscriptionsRepository
let sut: CreateCheckoutUseCase

describe("Fetch Products Use Case", () => {
  beforeEach(() => {
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    fakePaymentGateway = new FakePaymentGateway(subscriptionsRepository)

    sut = new CreateCheckoutUseCase(fakePaymentGateway)
  })

  it("should be able to fetch products", async () => {
    const user = makeGardener()

    const result = await sut.execute({
      productId: "product-01",
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.checkout).toEqual(
        expect.objectContaining({
          url: expect.any(String),
          userId: user.id.toString(),
          createdAt: expect.any(Date),
        }),
      )
    }
  })
})
