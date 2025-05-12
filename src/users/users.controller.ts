import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user-dto";
import { UsersService } from "./users.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./user.model";
import { Roles } from "src/auth/roles-auth.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { AddRoleDto } from "./dto/add-role-dto";
import { ViewUserDto } from "./dto/view-user-dto";
import { RolesEnum } from "src/enum/Roles";
import { UpdateUserDto } from "./dto/update-user-dto";

@ApiTags("Пользователи")
@Controller("users")
export class UsersController {
  constructor(private userServise: UsersService) {}
  @ApiOperation({ summary: "Создать пользователя" })
  @ApiResponse({ status: 200, type: User })
  @Roles(RolesEnum.MANAGER)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userServise.createUser(userDto);
  }

  @ApiOperation({ summary: "Получить всех пользователей" })
  @ApiResponse({ status: 200, type: [User] })
  @Roles(RolesEnum.MANAGER)
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.userServise.getAllUsers();
  }

  @ApiOperation({ summary: "Получить пользователя по id" })
  @ApiResponse({ status: 200, type: ViewUserDto })
  @Get("/:id")
  getUserById(@Param("id") id: number) {
    return this.userServise.getUsersById(id);
  }

  @ApiOperation({ summary: "Выдача ролей" })
  @ApiResponse({ status: 200 })
  // @Roles(RolesEnum.MANAGER)
  // @UseGuards(RolesGuard)
  @Post("/role")
  addRole(@Body() dto: AddRoleDto) {
    return this.userServise.addRole(dto);
  }

  @ApiOperation({ summary: "Редактировать пользователя" })
  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserDto
  ) {
    return this.userServise.updateUser(id, updateDto);
  }
}
