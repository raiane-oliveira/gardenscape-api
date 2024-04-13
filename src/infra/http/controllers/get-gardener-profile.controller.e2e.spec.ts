import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { GardenerFactory } from "@/test/factories/make-gardener"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"

describe("Get Gardener Profile (E2E)", () => {
  let app: INestApplication
  let gardenerFactory: GardenerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [GardenerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    gardenerFactory = moduleRef.get(GardenerFactory)

    await app.init()
  })

  test("[GET] /gardeners/:username", async () => {
    const gardener = await gardenerFactory.makePrismaGardener({
      username: "johndoe",
    })

    const response = await request(app.getHttpServer()).get(
      `/gardeners/${gardener.username}`,
    )

    expect(response.statusCode).toBe(200)
    expect(response.body.gardener).toEqual(
      expect.objectContaining({
        username: "johndoe",
        gardens: expect.arrayContaining([]),
      }),
    )
  })
})
