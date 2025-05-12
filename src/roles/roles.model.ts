import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "src/users/user.model";

import { RolesEnum } from "src/enum/Roles";
import { UserRoles } from "src/user-role/user-role-model";

interface RoleCreationAttribute {
  value: string;
  description: string;
}

@Table({ tableName: "roles" })
export class Role extends Model<Role, RoleCreationAttribute> {
  @ApiProperty({ example: 1, description: "ID" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({
    example: RolesEnum.MANAGER,
    description: "Значение роли пользователя",
  })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare value: RolesEnum;

  @ApiProperty({ example: "Администратор", description: "Описание роли" })
  @Column({ type: DataType.STRING, allowNull: false })
  declare description: string;

  @BelongsToMany(() => User, () => UserRoles)
  declare users: User[];
}
