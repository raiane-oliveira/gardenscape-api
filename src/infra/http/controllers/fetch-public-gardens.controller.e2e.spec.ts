import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { GardenFactory } from "@/test/factories/make-garden"
import { GardenerFactory } from "@/test/factories/make-gardener"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"

describe("Fetch Public Gardens [E2E]", () => {
  let app: INestApplication
  let gardenerFactory: GardenerFactory
  let gardenFactory: GardenFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [GardenerFactory, GardenFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    gardenerFactory = moduleRef.get(GardenerFactory)
    gardenFactory = moduleRef.get(GardenFactory)

    await app.init()
  })

  test("[GET] /gardens ", async () => {
    const user = await gardenerFactory.makePrismaGardener()

    await gardenFactory.makePrismaGarden({
      name: "garden 1",
      gardenerId: user.id,
    })
    await gardenFactory.makePrismaGarden({
      name: "garden 2",
      gardenerId: user.id,
    })
    await gardenFactory.makePrismaGarden({
      name: "garden 3",
      visibility: "private",
      gardenerId: user.id,
    })

    const response = await request(app.getHttpServer()).get("/gardens")

    expect(response.statusCode).toBe(200)
    expect(response.body.gardens).toHaveLength(2)
    expect(response.body.gardens).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "garden 1",
          gardener: expect.objectContaining({
            id: user.id.toString(),
          }),
        }),
        expect.objectContaining({
          name: "garden 2",
          gardener: expect.objectContaining({
            id: user.id.toString(),
          }),
        }),
      ]),
    )
  })

  test("[GET] /gardens (get public gardens with pagination)", async () => {
    const user = await gardenerFactory.makePrismaGardener()

    for (let i = 3; i < 23; i++) {
      await gardenFactory.makePrismaGarden({
        name: `garden ${i + 1}`,
        gardenerId: user.id,
      })
    }

    const response = await request(app.getHttpServer()).get("/gardens").query({
      page: 2,
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.gardens).toHaveLength(2)
  })
})
