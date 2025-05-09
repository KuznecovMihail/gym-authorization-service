import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./user.model";
import { CreateUserDto } from "./dto/create-user-dto";
import { InjectModel } from "@nestjs/sequelize";
import { RolesService } from "src/roles/roles.service";
import { AddRoleDto } from "./dto/add-role-dto";
import { ViewUserDto } from "./dto/view-user-dto";
import { RolesEnum } from "src/enum/Roles";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.rolesService.getRoleByValue({
      value: RolesEnum.USER,
    });
    if (role !== null) {
      await user.$set("roles", [role.id]);
      user.dataValues.roles = [role.dataValues];
    }
    return user;
  }

  async getAllUsers() {
    const user = await this.userRepository.findAll({ include: { all: true } });
    const mappedUser = user.map((el) => this.transformUser(el));
    return mappedUser;
  }

  async getUsersByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async getUsersById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      include: { all: true },
    });

    if (user === null) {
      throw new HttpException(
        "Пользователь с таким id не найден",
        HttpStatus.NOT_FOUND
      );
    }
    return this.transformUser(user);
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.id);
    const role = await this.rolesService.getRoleByValue({ value: dto.value });
    if (user && role) {
      await user.$add("role", role.dataValues.id);
      return dto;
    }
    throw new HttpException(
      "Пользователь или роль не найдены",
      HttpStatus.NOT_FOUND
    );
  }

  async saveRefreshToken(userId: number, refreshToken: string | null) {
    await this.userRepository.update(
      { refreshToken },
      { where: { id: userId } }
    );
  }

  async getRefreshTokenByUserId(userId: number) {
    const token = this.userRepository
      .findByPk(userId)
      .then((data) => data?.dataValues?.refreshToken);
    return token;
  }

  private transformUser(user: User | null): ViewUserDto | null {
    if (!user) return null;
    const { dataValues } = user;
    const roles = user.dataValues.roles;
    const roleValues = roles.map((role) => role.dataValues.value);

    return {
      id: dataValues.id,
      email: dataValues.email,
      roles: roleValues,
    };
  }
}
