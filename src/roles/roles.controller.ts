import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role-dto";
import { Roles } from "src/auth/roles-auth.decorator";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Роли")
@Controller("roles")
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiOperation({ summary: "Создать роль" })
  @Post()
  create(@Body() roleDto: CreateRoleDto) {
    return this.rolesService.createRole(roleDto);
  }

  @ApiOperation({ summary: "Получить роль по значению" })
  @Get("/:value")
  getByValue(@Param("value") value: keyof typeof Roles) {
    return this.rolesService.getRoleByValue(value);
  }
}
