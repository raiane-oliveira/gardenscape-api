import { PaymentGateway } from "@/domain/billing/payment/gateway"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { StripePaymentGateway } from "./payment-gateway"

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PaymentGateway,
      useClass: StripePaymentGateway,
    },
  ],
  exports: [PaymentGateway],
})
export class PaymentModule {}
