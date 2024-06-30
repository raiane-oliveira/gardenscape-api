import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { GardenerFactory } from "@/test/factories/make-gardener"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"

describe("Fetch Products [E2E]", () => {
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

  test("[GET] /products", async () => {
    const user = await gardenerFactory.makePrismaGardener()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      username: user.username,
    })

    const response = await request(app.getHttpServer())
      .get("/products")
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.products.length).gt(1)
    expect(response.body.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          features: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
            }),
          ]),
        }),
      ]),
    )
  })
})
