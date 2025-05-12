// user-roles.service.ts
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { UserRoles } from "./user-role-model";
import { CreateUserRoleDto } from "./dto/create-user-role.dto";

@Injectable()
export class UserRoleService {
  constructor(
    @InjectModel(UserRoles)
    private readonly userRoleRepository: typeof UserRoles
  ) {}

  async removeAllUserRoles(userId: number): Promise<void> {
    await this.userRoleRepository.destroy({
      where: { userId },
    });
  }

  async create(userRoleData: CreateUserRoleDto): Promise<UserRoles> {
    return this.userRoleRepository.create(userRoleData);
  }
}
