import { forwardRef, Module } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { BasketController } from "./basket.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Basket } from "./basket.model";
import { BasketItems } from "./basket-items.model";
import { User } from "src/users/user.model";
import { BasketUser } from "./basket-user.model";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { HealthyEatingModule } from "src/healthy-eating/healthy-eating.module";

@Module({
  controllers: [BasketController],
  providers: [BasketService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forFeature([Basket, BasketItems, User, BasketUser]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "SECRET",
      signOptions: {
        expiresIn: "24h",
      },
    }),
  ],
  exports: [SequelizeModule, BasketService],
})
export class BasketModule {}
