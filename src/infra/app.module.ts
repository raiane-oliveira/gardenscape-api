import { Module } from "@nestjs/common"
import { HttpModule } from "./http/http.module"
import { ConfigModule } from "@nestjs/config"
import { envSchema } from "./env"
import { AuthModule } from "./auth/auth.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    HttpModule,
    AuthModule,
  ],
})
export class AppModule {}
