import { AppModule } from "@/infra/app.module"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"

describe("Plants (E2E)", () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  test("[GET] /plants", async () => {
    const response = await request(app.getHttpServer()).get("/plants")

    expect(response.statusCode).toBe(200)

    expect(response.body.plants).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        links: expect.objectContaining({
          self: expect.any(String),
        }),
        meta: {
          total: expect.any(Number),
        },
      }),
    )
  })
})
