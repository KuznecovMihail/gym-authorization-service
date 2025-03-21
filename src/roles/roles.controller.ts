import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role-dto";
import { Roles } from "src/auth/roles-auth.decorator";

@Controller("roles")
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  create(@Body() roleDto: CreateRoleDto) {
    return this.rolesService.createRole(roleDto);
  }

  @Get("/:value")
  getByValue(@Param("value") value: keyof typeof Roles) {
    return this.rolesService.getRoleByValue(value);
  }
}
