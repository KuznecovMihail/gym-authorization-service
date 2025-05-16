import { Module } from "@nestjs/common";
import { HealthyEatingService } from "./healthy-eating.service";
import { HealthyEatingController } from "./healthy-eating.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/users/user.model";
import { HealthyEating } from "./healthy-eating.model";
import { FilesModule } from "src/files/files.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

@Module({
  controllers: [HealthyEatingController],
  providers: [HealthyEatingService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([HealthyEating]),
    FilesModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "SECRET",
      signOptions: {
        expiresIn: "24h",
      },
    }),
  ],
  exports: [SequelizeModule],
})
export class HealthyEatingModule {}
