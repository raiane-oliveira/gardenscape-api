import request from "supertest"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { AppModule } from "@/infra/app.module"
import { StorageModule } from "@/infra/storage/storage.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { JwtService } from "@nestjs/jwt"
import { GardenerFactory } from "@/test/factories/make-gardener"

describe("Upload gardener avatar [E2E]", () => {
  let app: INestApplication
  let gardenerFactory: GardenerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, StorageModule],
      providers: [GardenerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    gardenerFactory = moduleRef.get(GardenerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test("[POST] /gardeners/:username/upload-avatar", async () => {
    const user = await gardenerFactory.makePrismaGardener({
      username: "johndoe",
    })
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      username: user.username.toString(),
    })

    const response = await request(app.getHttpServer())
      .post(`/gardeners/johndoe/upload-avatar`)
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("file", "./src/test/e2e/sample-upload-avatar.jpg")

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      url: expect.any(String),
    })
  })
})
