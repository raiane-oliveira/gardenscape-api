import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { GardenFactory } from "@/test/factories/make-garden"
import { GardenerFactory } from "@/test/factories/make-gardener"
import { PlantFactory } from "@/test/factories/make-plant"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"

describe("Gardens [E2E]", () => {
  let app: INestApplication
  let prisma: PrismaService
  let gardenerFactory: GardenerFactory
  let gardenFactory: GardenFactory
  let plantFactory: PlantFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [GardenerFactory, GardenFactory, PlantFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    gardenerFactory = moduleRef.get(GardenerFactory)
    gardenFactory = moduleRef.get(GardenFactory)
    plantFactory = moduleRef.get(PlantFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[GET] /gardens/:slug (get user garden)", async () => {
    const user = await gardenerFactory.makePrismaGardener()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      username: user.username,
    })

    const garden = await gardenFactory.makePrismaGarden({
      name: "Garden 01",
      gardenerId: user.id,
    })

    plantFactory.makePrismaPlant({
      plantId: "1",
      gardenId: garden.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/gardens/${garden.slug.value}`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.garden).toEqual(
      expect.objectContaining({
        name: "Garden 01",
        gardener: expect.objectContaining({
          id: user.id.toString(),
        }),
        plants: expect.arrayContaining([
          expect.objectContaining({
            plantId: "1",
          }),
        ]),
      }),
    )
  })

  test("[POST] /gardens (create garden)", async () => {
    const user = await gardenerFactory.makePrismaGardener()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      username: user.username,
    })

    const response = await request(app.getHttpServer())
      .post("/gardens")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Javascript's garden",
      })

    expect(response.statusCode).toBe(201)
    expect(response.body.garden).toEqual(
      expect.objectContaining({
        name: "Javascript's garden",
      }),
    )

    const gardenOnDatabase = await prisma.garden.findFirst({
      where: {
        name: "Javascript's garden",
      },
    })

    expect(gardenOnDatabase).toBeTruthy()
  })

  test("[POST] /gardens (create private garden)", async () => {
    const user = await gardenerFactory.makePrismaGardener()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      username: user.username,
    })

    const response = await request(app.getHttpServer())
      .post("/gardens")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Javascript's garden 2",
        visibility: "private",
      })

    expect(response.statusCode).toBe(201)
    expect(response.body.garden).toEqual(
      expect.objectContaining({
        name: "Javascript's garden 2",
        visibility: "private",
      }),
    )

    const gardenOnDatabase = await prisma.garden.findFirst({
      where: {
        visibility: "PRIVATE",
      },
    })

    expect(gardenOnDatabase).toBeTruthy()
  })

  test("[PUT] /gardens/:gardenId", async () => {
    const user = await gardenerFactory.makePrismaGardener()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      username: user.username,
    })

    const garden = await gardenFactory.makePrismaGarden({
      gardenerId: user.id,
    })

    expect(garden.visibility).toEqual("public")

    const response = await request(app.getHttpServer())
      .put(`/gardens/${garden.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Edited garden",
        visibility: "private",
      })

    expect(response.statusCode).toBe(204)

    const gardenOnDatabase = await prisma.garden.findFirst({
      where: {
        name: "Edited garden",
      },
    })

    expect(gardenOnDatabase).toBeTruthy()
    expect(gardenOnDatabase?.visibility).toEqual("PRIVATE")
    expect(gardenOnDatabase?.name).toEqual("Edited garden")
  })

  test("[DELETE] /gardens/:gardenId", async () => {
    const user = await gardenerFactory.makePrismaGardener()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      username: user.username,
    })

    const garden = await gardenFactory.makePrismaGarden({
      gardenerId: user.id,
    })

    const response = await request(app.getHttpServer())
      .delete(`/gardens/${garden.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const gardenOnDatabase = await prisma.garden.findUnique({
      where: {
        id: user.id.toString(),
      },
    })

    expect(gardenOnDatabase).toBeNull()
  })
})
