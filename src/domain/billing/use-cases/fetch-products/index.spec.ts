import { FakePaymentGateway } from "@/test/payment/fake-gateway"
import { FetchProductsUseCase } from "."
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

let billingRepository: FakePaymentGateway
let sut: FetchProductsUseCase

describe("Fetch Products Use Case", () => {
  beforeEach(() => {
    billingRepository = new FakePaymentGateway()

    sut = new FetchProductsUseCase(billingRepository)
  })

  it("should be able to fetch products", async () => {
    const result = await sut.execute()

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(2)
      expect(result.value.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            productId: new UniqueEntityId("product-01"),
          }),
        ]),
      )
    }
  })
})
