import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role-dto";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "./roles.model";
import { GetRoleDto } from "./dto/get-role-dto";

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async createRole(dto: CreateRoleDto) {
    const role = this.roleRepository.create(dto);
    return role;
  }

  async getRoleByValue({ value }: GetRoleDto) {
    const role = this.roleRepository.findOne({ where: { value } });
    return role;
  }
}
