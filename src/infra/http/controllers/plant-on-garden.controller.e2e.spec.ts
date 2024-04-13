import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { GardenFactory } from "@/test/factories/make-garden"
import { GardenerFactory } from "@/test/factories/make-gardener"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"

describe("Plant On Garden [E2E]", () => {
  let app: INestApplication
  let prisma: PrismaService
  let gardenerFactory: GardenerFactory
  let gardenFactory: GardenFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [GardenerFactory, GardenFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    gardenerFactory = moduleRef.get(GardenerFactory)
    gardenFactory = moduleRef.get(GardenFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[POST] /gardens/:gardenId/plant", async () => {
    const user = await gardenerFactory.makePrismaGardener()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      username: user.username,
    })

    const garden = await gardenFactory.makePrismaGarden({
      gardenerId: user.id,
    })
    await gardenFactory.makePrismaGarden({
      gardenerId: user.id,
    })

    const response = await request(app.getHttpServer())
      .post(`/gardens/${garden.id.toString()}/plant`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        plantId: 1,
      })

    expect(response.statusCode).toBe(201)

    const plantOnDatabase = await prisma.plantOnGarden.findFirst({
      where: {
        gardenId: garden.id.toString(),
      },
    })

    expect(plantOnDatabase).toBeTruthy()
  })

  test("[POST] /gardens/:gardenId/plant (should not be able to plant from another user)", async () => {
    const user = await gardenerFactory.makePrismaGardener()
    const user2 = await gardenerFactory.makePrismaGardener()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      username: user.username,
    })

    const garden = await gardenFactory.makePrismaGarden({
      gardenerId: user2.id,
    })
    await gardenFactory.makePrismaGarden({
      gardenerId: user.id,
    })

    const response = await request(app.getHttpServer())
      .post(`/gardens/${garden.id.toString()}/plant`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        plantId: "2",
      })

    expect(response.statusCode).toBe(401)
  })
})
