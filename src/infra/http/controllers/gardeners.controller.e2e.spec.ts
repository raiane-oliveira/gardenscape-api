import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { GardenerFactory } from "@/test/factories/make-gardener"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { hash } from "bcryptjs"
import request from "supertest"

describe("Gardeners (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService
  let gardenerFactory: GardenerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [GardenerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    gardenerFactory = moduleRef.get(GardenerFactory)

    await app.init()
  })

  test("[POST] /gardeners/register", async () => {
    const response = await request(app.getHttpServer())
      .post("/gardeners/register")
      .send({
        name: "John Doe",
        username: "johndoe",
        email: "johndoe@example.com",
        password: "123456",
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        username: "johndoe",
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })

  test("[POST] /gardeners/authenticate", async () => {
    await gardenerFactory.makePrismaGardener({
      username: "johndoe",
      password: await hash("123456", 8),
    })

    const response = await request(app.getHttpServer())
      .post("/gardeners/authenticate")
      .send({
        username: "johndoe",
        password: "123456",
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
