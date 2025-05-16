import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./user.model";
import { Role } from "src/roles/roles.model";

import { RolesModule } from "src/roles/roles.module";
import { AuthModule } from "src/auth/auth.module";
import { UserRoles } from "src/user-role/user-role-model";
import { FilesModule } from "src/files/files.module";
import { BasketUser } from "src/basket/basket-user.model";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles, BasketUser]),
    RolesModule,
    FilesModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
