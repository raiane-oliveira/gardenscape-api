import { AppModule } from "@/infra/app.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"

describe("Gardeners (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

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

  test("[POST] /gardeners/authenticate (authenticate with wrong password)", async () => {
    const response = await request(app.getHttpServer())
      .post("/gardeners/authenticate")
      .send({
        username: "johndoe",
        password: "1234567",
      })

    expect(response.statusCode).toBe(401)
  })
})
