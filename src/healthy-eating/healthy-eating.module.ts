import { Module } from "@nestjs/common";
import { HealthyEatingService } from "./healthy-eating.service";
import { HealthyEatingController } from "./healthy-eating.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/users/user.model";
import { HealthyEating } from "./healthy-eating.model";
import { FilesModule } from "src/files/files.module";

@Module({
  controllers: [HealthyEatingController],
  providers: [HealthyEatingService],
  imports: [
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([HealthyEating]),
    FilesModule,
  ],
  exports: [SequelizeModule],
})
export class HealthyEatingModule {}
