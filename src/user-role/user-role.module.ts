import { Module } from "@nestjs/common";

import { UserRoleController } from "./user-role.controller";
import { UserRoleService } from "./user-role.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserRoles } from "./user-role-model";

@Module({
  imports: [SequelizeModule.forFeature([UserRoles])],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
