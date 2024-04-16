import { Env } from "@/infra/env"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class TrefleApi {
  baseUrl: string

  constructor(private config: ConfigService<Env, true>) {
    this.baseUrl = this.config.get("TREFLE_BASE_API_URL")
  }

  fetch(path: string, config?: RequestInit) {
    const url = new URL(`/api/v1${path}`, this.baseUrl)

    url.searchParams.append("token", this.config.get("TREFLE_API_TOKEN"))

    return fetch(url, config)
  }
}
