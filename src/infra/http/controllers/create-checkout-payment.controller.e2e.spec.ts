import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { GardenerFactory } from "@/test/factories/make-gardener"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"

describe("Create Checkout Payment [E2E]", () => {
  let app: INestApplication
  let gardenerFactory: GardenerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [GardenerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    gardenerFactory = moduleRef.get(GardenerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[POST] /products/:productId/checkout", async () => {
    const user = await gardenerFactory.makePrismaGardener()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      username: user.username,
    })

    const responseProducts = await request(app.getHttpServer()).get("/products")

    const product = responseProducts.body.products[0]
    const productId = product.id

    const checkoutResponse = await request(app.getHttpServer())
      .post(`/products/${productId}/checkout`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(checkoutResponse.statusCode).toBe(201)
    expect(checkoutResponse.body).toEqual(
      expect.objectContaining({
        checkoutUrl: expect.any(String),
      }),
    )
  })
})
