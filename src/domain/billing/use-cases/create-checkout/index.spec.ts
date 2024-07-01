import { FakePaymentGateway } from "@/test/payment/fake-gateway"
import { CreateCheckoutUseCase } from "."

let fakePaymentGateway: FakePaymentGateway
let sut: CreateCheckoutUseCase

describe("Fetch Products Use Case", () => {
  beforeEach(() => {
    fakePaymentGateway = new FakePaymentGateway()

    sut = new CreateCheckoutUseCase(fakePaymentGateway)
  })

  it("should be able to fetch products", async () => {
    const result = await sut.execute({
      productId: "product-01",
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.checkout).toEqual(
        expect.objectContaining({
          url: expect.any(String),
          createdAt: expect.any(Date),
        }),
      )
    }
  })
})
