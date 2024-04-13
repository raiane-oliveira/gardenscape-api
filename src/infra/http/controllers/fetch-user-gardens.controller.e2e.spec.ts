import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { GardenFactory } from "@/test/factories/make-garden"
import { GardenerFactory } from "@/test/factories/make-gardener"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import { randomUUID } from "crypto"
import request from "supertest"

describe("Fetch User Gardens [E2E]", () => {
  let app: INestApplication
  let gardenerFactory: GardenerFactory
  let gardenFactory: GardenFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [GardenerFactory, GardenFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    gardenerFactory = moduleRef.get(GardenerFactory)
    gardenFactory = moduleRef.get(GardenFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test("[GET] /user/gardens ", async () => {
    const user = await gardenerFactory.makePrismaGardener()
    const accessToken = jwtService.sign({
      sub: user.id.toString(),
      username: user.username,
    })

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

    const response = await request(app.getHttpServer())
      .get("/user/gardens")
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.gardens).toHaveLength(3)
    expect(response.body.gardens).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "garden 1",
        }),
        expect.objectContaining({
          name: "garden 2",
        }),
        expect.objectContaining({
          name: "garden 3",
        }),
      ]),
    )
  })

  test("[GET] /user/gardens (get user gardens with pagination)", async () => {
    const user = await gardenerFactory.makePrismaGardener()
    const accessToken = jwtService.sign({
      sub: user.id.toString(),
      username: user.username,
    })

    for (let i = 0; i < 22; i++) {
      await gardenFactory.makePrismaGarden({
        name: `garden ${randomUUID()}`,
        gardenerId: user.id,
      })
    }

    const response = await request(app.getHttpServer())
      .get("/user/gardens")
      .query({
        page: 2,
      })
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.gardens).toHaveLength(2)
  })
})
