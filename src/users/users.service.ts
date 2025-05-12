import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { User } from "./user.model";
import { CreateUserDto } from "./dto/create-user-dto";
import { InjectModel } from "@nestjs/sequelize";
import { RolesService } from "src/roles/roles.service";
import { AddRoleDto } from "./dto/add-role-dto";
import { ViewUserDto } from "./dto/view-user-dto";
import { RolesEnum } from "src/enum/Roles";

import { UserRoles } from "src/user-role/user-role-model";
import { UpdateUserDto } from "./dto/update-user-dto";
import { UserRoleService } from "src/user-role/user-role.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService,
    private userRolesService: UserRoleService
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.rolesService.getRoleByValue({
      value: RolesEnum.USER,
    });
    if (!role) throw new NotFoundException("Role not found");
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

  async updateUser(id: number, updateDto: UpdateUserDto) {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const { roles, ...data } = updateDto;

    await user.update(data);

    if (!!roles?.length) {
      await this.updateUserRoles(user, roles);
    }
  }

  private async updateUserRoles(user: User, roles: RolesEnum[]): Promise<void> {
    const roleInstances = await Promise.all(
      roles.map((value) => this.rolesService.getRoleByValue({ value }))
    );

    if (roleInstances.some((role) => !role)) {
      const missingRoles = roles.filter((_, i) => !roleInstances[i]);
      throw new NotFoundException(
        `Роли ${missingRoles.join(", ")} не существуют`
      );
    }

    const rolesId = roleInstances
      .map((el) => el?.id)
      .filter((el) => el !== undefined);

    if (!rolesId.length) {
      throw new NotFoundException("Пользователь или роль не найдены");
    }

    await user.$set("roles", rolesId);
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
      sex: dataValues.sex,
      height: dataValues.height,
      weight: dataValues.weight,
      age: dataValues.age,
    };
  }
}
